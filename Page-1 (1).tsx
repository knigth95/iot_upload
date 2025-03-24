// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState } from 'react';

const App: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleLogin = () => {
    // 处理登录逻辑
    console.log('Login with:', username, password);
  };

  const handleRegister = () => {
    if (isLoginView) {
      setIsLoginView(false);
      setUsername('');
      setPassword('');
    } else {
      // 处理注册逻辑
      console.log('Register with:', username, email, password);
    }
  };

  return (
<div className="flex min-h-screen bg-white">
{/* 左侧品牌区 */}
<div className="w-1/2 bg-[#2D3748] p-12 flex flex-col relative">
<h1 className="text-white text-2xl font-medium mb-8">
Hummingbird 物联网平台
</h1>
<div className="flex-1 flex items-center justify-center">
<img
src="https://public.readdy.ai/ai/img_res/e41fa0ad6e9904baddc81f7ccb134f41.jpg"
alt="Platform Illustration"
className="w-full max-w-md object-contain"
/>
</div>
</div>
{/* 右侧登录区 */}
<div className="w-1/2 p-12 flex flex-col justify-center">
<div className="max-w-md w-full mx-auto">
  <h2 className="text-2xl font-medium mb-8">{isLoginView ? '密码登录' : '用户注册'}</h2>
  <div className="space-y-6">
    <div>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500 text-sm"
        placeholder="用户名"
      />
    </div>
    {!isLoginView && (
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500 text-sm"
          placeholder="邮箱"
        />
      </div>
    )}
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500 text-sm"
        placeholder="密码"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
      >
        <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
      </button>
    </div>
    <div className="flex gap-4">
      {isLoginView ? (
        <>
          <button
            onClick={handleLogin}
            className="flex-1 bg-[#2D3748] text-white px-6 py-3 rounded-lg text-base font-medium hover:bg-[#1A202C] transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer"
          >
            登录
          </button>
          <button
            onClick={handleRegister}
            className="flex-1 bg-[#2D3748] text-white px-6 py-3 rounded-lg text-base font-medium hover:bg-[#1A202C] transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer"
          >
            注册
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => setIsLoginView(true)}
            className="flex-1 bg-[#2D3748] text-white px-6 py-3 rounded-lg text-base font-medium hover:bg-[#1A202C] transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer"
          >
            返回登录
          </button>
          <button
            onClick={handleRegister}
            className="flex-1 bg-[#2D3748] text-white px-6 py-3 rounded-lg text-base font-medium hover:bg-[#1A202C] transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer"
          >
            确认注册
          </button>
        </>
      )}
    </div>
  </div>
</div>
</div>
</div>
);
};
export default App
