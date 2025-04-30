import React, { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    if (window.feather) {
      window.feather.replace(); 
    }
  }, []);

  const classes = [
    { name: 'PNV25A', color: 'bg-purple-100' },
    { name: 'PNV25B', color: 'bg-purple-100' },
    { name: 'PNV26A', color: 'bg-blue-100' },
    { name: 'PNV26B', color: 'bg-blue-100' },
    { name: 'PNV27A', color: 'bg-green-100' },
    { name: 'PNV27B', color: 'bg-green-100' },
    { name: 'PNV27B', color: 'bg-green-100' },
    { name: 'PNV27B', color: 'bg-green-100' },
    { name: 'PNV27B', color: 'bg-green-100' },
  ];

  return (
    <div style={{ backgroundColor: '#f5f5f5', height: '100vh' }}>
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="font-bold text-orange-500">StudeeFlow</span>
          </div>
          <nav className="space-x-24 text-sm">
            <a href="#" className="text-gray-500 hover:text-orange-500">Home</a>
            <a href="#" className="text-gray-500 hover:text-orange-500">Profile</a>
          </nav>
          <div className="flex items-center gap-4">
            <i data-feather="help-circle" className="w-5 h-5"></i>
            <div className="relative">
              <i data-feather="bell" className="w-5 h-5"></i>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <section className="max-w-7xl mx-auto px-6 py-10">
          <div className="bg-white p-8 rounded-xl shadow px-[65px]">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <h2 className="text-lg font-semibold">All classes</h2>

              {/* Search Box */}
              <div className="relative w-96">
                <input
                  type="text"
                  placeholder="Search ..."
                  className="pr-10 pl-4 py-2 border rounded-3xl w-full focus:outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <i data-feather="search" className="w-4 h-4"></i>
                </span>
              </div>
            </div>

            {/* Class Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
              {classes.map((cls, idx) => (
                <div
                  key={idx}
                  className={`${cls.color} p-5 pl-10 rounded-xl shadow-sm transition transform hover:scale-105 hover:shadow-md cursor-pointer w-[330px]`}
                >
                  <h3 className="font-semibold text-lg mb-2">{cls.name}</h3>
                  <div className="flex items-center text-sm gap-3">
                    <i data-feather="users" className="w-4 h-4"></i>
                    <span>20 students</span>
                    <i data-feather="monitor" className="w-4 h-4 ml-4"></i>
                    <span>2 teachers</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
export default Home;
