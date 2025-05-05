import React, { useState, useEffect } from 'react';
import {getAllClassrooms} from '../../services/ClassroomService';

function CreateStudentsForm() {
  const [emailList, setEmailList] = useState('');
  const [password, setPassword] = useState('');
  const [classroom, setClassroom] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await getAllClassrooms();
        setClasses(response);
      } catch (error) {
        console.error("Failed to fetch classes:", error);
      }
    };

    fetchClasses();
  }, []);

  const handleCreate = () => {
    console.log('Emails:', emailList);
    console.log('Password:', password);
    console.log('Classroom:', classroom);
  };

  const handleCancel = () => {
    setEmailList('');
    setPassword('');
    if (classes.length > 0) {
      setClassroom(classes[0].name);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
      <div
        className="bg-white rounded-lg shadow-lg p-8"
        style={{ width: '800px', height: '480px', paddingLeft: '100px', paddingRight: '100px' }}
      >
        <h2 className="text-xl font-semibold text-center mb-6">Create Student Accounts</h2>

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Email address
        </label>
        <textarea
          value={emailList}
          onChange={(e) => setEmailList(e.target.value)}
          placeholder="Email address"
          rows={6}
          className="w-full p-3 border border-gray-300 rounded-md resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ height: '160px' }}
        />
        <div className="flex items-center gap-6 mt-6">
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Default password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Default password"
                className="w-full p-3 pr-10 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="text-gray-500"
                >
                  {showPassword ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.11-3.637M6.933 6.933A9.955 9.955 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.956 9.956 0 01-2.11 3.637M15 12a3 3 0 11-6 0 3 3 0 016 0zM3 3l18 18"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Classroom
            </label>
            <div className="relative">
              <select
                value={classroom}
                onChange={(e) => setClassroom(e.target.value)}
                className="w-full p-3 pr-10 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.classroom}>
                    {cls.classroom}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-3 h-3 fill-black" viewBox="0 0 10 6" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 0L5 6L10 0H0Z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-x-8 mt-8">
          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            style={{ width: '170px', height: '35px' }}
          >
            Create
          </button>
          <button
            onClick={handleCancel}
            className="bg-red-500 hover:bg-red-600 text-white rounded-md"
            style={{ width: '170px', height: '35px' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateStudentsForm;
