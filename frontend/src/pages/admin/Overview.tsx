import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../contexts/ModalContext';

const Overview = () => {
    const navigate = useNavigate();
    const { showAlert } = useModal();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/admin/stats', {
                headers: { 'x-auth-token': token || '' }
            });
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            } else {
                showAlert({ message: 'Failed to load statistics', type: 'error' });
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
            showAlert({ message: 'Error loading statistics', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-center py-12">
                <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4 block">bar_chart</span>
                <p className="text-gray-500 dark:text-gray-400">No data available</p>
                <button
                    onClick={fetchStats}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Real-time statistics and insights</p>
                </div>
                <button
                    onClick={fetchStats}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-lg">refresh</span>
                    Refresh
                </button>
            </div>

            {/* Today's Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Today's Total</p>
                            <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{stats.today.total}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-2xl">today</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Upcoming Today</p>
                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">{stats.today.upcoming}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-2xl">schedule</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Completed Today</p>
                            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.today.completed}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-2xl">check_circle</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Cancelled Today</p>
                            <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">{stats.today.cancelled}</p>
                        </div>
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-2xl">cancel</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Week and Month Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">This Week</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">Total Appointments</span>
                            <span className="font-bold text-gray-800 dark:text-white">{stats.week.total}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">Completed</span>
                            <span className="font-bold text-green-600 dark:text-green-400">{stats.week.completed}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">Cancelled</span>
                            <span className="font-bold text-red-600 dark:text-red-400">{stats.week.cancelled}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                            <span className="text-gray-600 dark:text-gray-400">No-Show Rate</span>
                            <span className="font-bold text-orange-600 dark:text-orange-400">{stats.week.noShowRate}%</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">This Month</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">Total Appointments</span>
                            <span className="font-bold text-gray-800 dark:text-white">{stats.month.total}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">Completed</span>
                            <span className="font-bold text-green-600 dark:text-green-400">{stats.month.completed}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">Cancelled</span>
                            <span className="font-bold text-red-600 dark:text-red-400">{stats.month.cancelled}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                            <span className="text-gray-600 dark:text-gray-400">Avg. Per Day</span>
                            <span className="font-bold text-blue-600 dark:text-blue-400">{stats.month.avgPerDay}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Breakdown and Doctor Workload */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Breakdown */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Status Breakdown (This Month)</h3>
                    <div className="space-y-3">
                        {stats.statusBreakdown.map((item: any, index: number) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${
                                        item.status === 'completed' ? 'bg-green-500' :
                                        item.status === 'upcoming' ? 'bg-blue-500' :
                                        item.status === 'cancelled' ? 'bg-red-500' : 'bg-gray-500'
                                    }`}></div>
                                    <span className="text-gray-700 dark:text-gray-300 capitalize">{item.status}</span>
                                </div>
                                <span className="font-bold text-gray-800 dark:text-white">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Peak Booking Times */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Peak Booking Times</h3>
                    <div className="space-y-2">
                        {stats.peakTimes.slice(0, 5).map((item: any, index: number) => (
                            <div key={index} className="flex items-center gap-3">
                                <div className="w-16 text-sm text-gray-600 dark:text-gray-400">
                                    {item.hour}:00
                                </div>
                                <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-6 relative overflow-hidden">
                                    <div
                                        className="bg-primary h-full rounded-full flex items-center justify-end pr-2"
                                        style={{ width: `${(item.count / Math.max(...stats.peakTimes.map((p: any) => p.count))) * 100}%` }}
                                    >
                                        <span className="text-xs font-bold text-white">{item.count}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Doctor Workload */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">Doctor Workload (This Month)</h3>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-900/50">
                                    <tr>
                                        <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap">Doctor</th>
                                        <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap">Specialty</th>
                                        <th className="text-center py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap">Today</th>
                                        <th className="text-center py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                                    {stats.doctorWorkload.map((doctor: any, index: number) => (
                                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-800 dark:text-white font-medium whitespace-nowrap">{doctor.name}</td>
                                            <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{doctor.specialty}</td>
                                            <td className="py-2 sm:py-3 px-2 sm:px-4 text-center">
                                                <span className="inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs sm:text-sm font-bold">
                                                    {doctor.todayCount}
                                                </span>
                                            </td>
                                            <td className="py-2 sm:py-3 px-2 sm:px-4 text-center text-xs sm:text-sm font-bold text-gray-800 dark:text-white whitespace-nowrap">{doctor.totalCount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white mb-3 sm:mb-4 text-center">Quick Actions</h3>
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                    <button
                        onClick={() => {
                            navigate('/admin-dashboard/doctors');
                        }}
                        className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-primary text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1.5 sm:gap-2"
                    >
                        <span className="material-symbols-outlined text-base sm:text-lg">person_add</span>
                        Add Doctor
                    </button>
                    <button
                        onClick={() => {
                            navigate('/admin-dashboard/appointments');
                        }}
                        className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5 sm:gap-2"
                    >
                        <span className="material-symbols-outlined text-base sm:text-lg">event</span>
                        View Today's Appointments
                    </button>
                    <button
                        onClick={() => {
                            navigate('/admin-dashboard/reports');
                        }}
                        className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1.5 sm:gap-2"
                    >
                        <span className="material-symbols-outlined text-base sm:text-lg">assessment</span>
                        Generate Monthly Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Overview;

