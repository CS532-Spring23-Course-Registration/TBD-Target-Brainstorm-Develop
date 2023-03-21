import { Link, Outlet } from "react-router-dom";

function Dashboard() {
    return (
        <div>
            <div>
                Dashboard
            </div>
            <Link to="/login">Login</Link>
        </div>
    );
}

export default Dashboard;