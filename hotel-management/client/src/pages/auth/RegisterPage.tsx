import React from 'react';

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="card p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">First Name</label>
              <input type="text" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Last Name</label>
              <input type="text" className="input" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input type="password" className="input" />
          </div>
          <button type="submit" className="w-full btn btn-primary py-2">
            Register
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account? <a href="/auth/login" className="text-blue-600 font-semibold">Login</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
