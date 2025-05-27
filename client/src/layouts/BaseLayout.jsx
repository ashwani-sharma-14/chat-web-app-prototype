import { Link, useNavigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";

const BaseLayout = () => {
  const navigate = useNavigate();
  const { authState, logout } = useAuthStore();

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      <div className="navbar bg-base-200">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost normal-case text-xl">
            ChatApp
          </Link>
        </div>
        <div className="flex-none gap-2">
          {authState ? (
            // Show when user is logged in
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  {authState.profile ? (
                    <img src={authState.profile} alt={authState.name} />
                  ) : (
                    <img
                      src={`https://ui-avatars.com/api/?name=${authState.name}`}
                      alt={authState.name}
                    />
                  )}
                </div>
              </label>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link to="/settings">Settings</Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="text-error">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            // Show when user is not logged in
            <Link to="/settings" className="btn btn-ghost btn-circle">
              <Cog6ToothIcon className="w-6 h-6" />
            </Link>
          )}
        </div>
      </div>
      <main className="container mx-auto px-4">
        <Outlet />
      </main>
    </div>
  );
};

export default BaseLayout;
