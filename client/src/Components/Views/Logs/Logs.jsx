import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../../contexts';
import axiosInstance from '../../../API/axiosInstance';
import './Logs.css';

const Logs = () => {
    const { user } = useContext(AuthContext);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axiosInstance.get('/logs');
                setLogs(response.data.data);
            } catch (err) {
                setError('Failed to fetch logs');
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [user]);

    if (loading) return <div className="log-loading">Loading logs...</div>;
    if (error) return <div className="log-error">Error: {error}</div>;

    return (
        <div className="logs-page">
            <h1 className="logs-header">System Logs</h1>
            <div className="logs-table-wrapper">
                <table className="logs-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Level</th>
                            <th>Message</th>
                            <th>Context</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr key={log.id}>
                                <td>{log.id}</td>
                                <td className={`log-level ${log.level.toLowerCase()}`}>{log.level}</td>
                                <td>{log.message}</td>
                                <td>{log.context || '—'}</td>
                                <td>{new Date(log.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export { Logs };
