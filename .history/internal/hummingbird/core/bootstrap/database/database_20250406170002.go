//
// Copyright (C) 2020 IOTech Ltd
//
// SPDX-License-Identifier: Apache-2.0

package database

import (
	"context"
	"errors"
	"iot_pj/internal/dtos"
	"iot_pj/internal/hummingbird/core/config"
	"iot_pj/internal/hummingbird/core/container"
	"iot_pj/internal/hummingbird/core/infrastructure/mysql"
	"iot_pj/internal/hummingbird/core/infrastructure/sqlite"
	"iot_pj/internal/pkg/constants"
	"iot_pj/internal/tools/datadb/tdengine"

	"iot_pj/internal/pkg/di"
	"iot_pj/internal/pkg/logger"
	"iot_pj/internal/pkg/startup"
	"iot_pj/internal/tools/datadb/leveldb"
	"sync"

	interfaces "iot_pj/internal/hummingbird/core/interface"
	pkgContainer "iot_pj/internal/pkg/container"
)

// Database contains references to dependencies required by the database bootstrap implementation.
type Database struct {
	database *config.ConfigurationStruct
}

// NewDatabase is a factory method that returns an initialized Database receiver struct.
func NewDatabase(database *config.ConfigurationStruct) Database {
	return Database{
		database: database,
	}
}

// Return the dbClient interfaces
func (d Database) newDBClient(
	lc logger.LoggingClient) (interfaces.DBClient, error) {

	databaseInfo := d.database.GetDatabaseInfo()["Primary"]
	switch databaseInfo.Type {
	case string(constants.MySQL):
		return mysql.NewClient(dtos.Configuration{
			Dsn: databaseInfo.Dsn,
		}, lc)
	case string(constants.SQLite):
		// Check if database file exists
		if _, err := os.Stat(databaseInfo.DataSource); os.IsNotExist(err) {
			lc.Info("Database file does not exist, creating new database")
			// Create database file
			file, err := os.Create(databaseInfo.DataSource)
			if err != nil {
				return nil, fmt.Errorf("failed to create database file: %v", err)
			}
			file.Close()
		}

		client, err := sqlite.NewClient(dtos.Configuration{
			Username:   databaseInfo.Username,
			Password:   databaseInfo.Password,
			DataSource: databaseInfo.DataSource,
		}, lc)
		if err != nil {
			return nil, err
		}

		// Execute initialization SQL
		initSQL, err := os.ReadFile("cmd/iot-core/res/AI_init.sql")
		if err != nil {
			return nil, fmt.Errorf("failed to read initialization SQL: %v", err)
		}

		if _, err := client.Exec(string(initSQL)); err != nil {
			return nil, fmt.Errorf("failed to execute initialization SQL: %v", err)
		}

		return client, nil
	default:
		panic(errors.New("database configuration error"))
	}
}

func (d Database) newDataDBClient(
	lc logger.LoggingClient) (interfaces.DataDBClient, error) {
	dataDbInfo := d.database.GetDataDatabaseInfo()["Primary"]

	switch dataDbInfo.Type {
	case string(constants.LevelDB):
		return leveldb.NewClient(dtos.Configuration{
			DataSource: dataDbInfo.DataSource,
		}, lc)
	case string(constants.TDengine):
		return tdengine.NewClient(dtos.Configuration{
			Dsn: dataDbInfo.Dsn,
		}, lc)
	default:
		panic(errors.New("database configuration error"))

	}
}

// BootstrapHandler fulfills the BootstrapHandler contract and initializes the database.
func (d Database) BootstrapHandler(
	ctx context.Context,
	wg *sync.WaitGroup,
	startupTimer startup.Timer,
	dic *di.Container) bool {
	lc := pkgContainer.LoggingClientFrom(dic.Get)

	// initialize Metadata db.
	dbClient, err := d.newDBClient(lc)
	if err != nil {
		panic(err)
	}

	dic.Update(di.ServiceConstructorMap{
		container.DBClientInterfaceName: func(get di.Get) interface{} {
			return dbClient
		},
	})

	// Initialize the GetDB function for direct DB access
	if sqliteClient, ok := dbClient.(*sqlite.Client); ok {
		sqlite.InitDB(sqliteClient.Pool)
	}

	// initialize Data db.
	dataDbClient, err := d.newDataDBClient(lc)
	if err != nil {
		panic(err)
	}

	dic.Update(di.ServiceConstructorMap{
		container.DataDBClientInterfaceName: func(get di.Get) interface{} {
			return dataDbClient
		},
	})

	lc.Info("DatabaseInfo connected")

	wg.Add(1)
	go func() {
		defer wg.Done()
		select {
		case <-ctx.Done():
			interfaces.DMIFrom(di.GContainer.Get).StopAllInstance() //stop all instance
			container.DBClientFrom(di.GContainer.Get).CloseSession()
			container.DataDBClientFrom(di.GContainer.Get).CloseSession()
			lc.Info("DatabaseInfo disconnected")
		}
	}()
	return true
}
