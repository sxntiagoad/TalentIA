import { Link } from 'react-router-dom';

export function Navigation() {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-800">
      <h1 className="font-bold text-3xl text-white">TalentIA</h1>
      <Link to="/user-form">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          User Form
        </button>
      </Link>
    </div>
  );
}