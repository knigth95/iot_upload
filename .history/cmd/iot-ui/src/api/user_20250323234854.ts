export const Register = (data: {
  username: string;
  password: string;
  email: string;
}) => {
  return request.post('/api/v1/auth/register', data);
};

  // 安装 axios: npm install axios
  import axios from 'axios';
  
  // 创建 Axios 实例，设置基础路径
  const apiClient = axios.create({
    baseURL: 'http://your-api-domain.com', // 替换为实际 API 地址
    timeout: 5000, // 请求超时时间
  });
  
  export const Register = (data: {
    username: string;
    password: string;
    email: string;
  }) => {
    return apiClient.post('/api/v1/auth/register', data);
  };