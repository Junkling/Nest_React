import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>404 - Page Not Found</h1>
            <p>We couldn't find the page you're looking for.</p>
            <Link to="/" style={{ color: 'blue', textDecoration: 'underline' }}>
                Go back to Home
            </Link>
        </div>
    );
};

export default NotFound;
