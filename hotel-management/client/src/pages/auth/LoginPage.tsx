import React from 'react';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="card p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input type="password" className="input" />
          </div>
          <button type="submit" className="w-full btn btn-primary py-2">
            Login
          </button>
        </form>
        <p className="text-center mt-4">
          Don't have an account? <a href="/auth/register" className="text-blue-600 font-semibold">Register</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
