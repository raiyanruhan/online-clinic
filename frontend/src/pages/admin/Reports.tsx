import { API_BASE_URL } from '../../config';
import { useState } from 'react';
import { useModal } from '../../contexts/ModalContext';
import { formatBDDate } from '../../utils/dateUtils';

const Reports = () => {
    const { showAlert } = useModal();
    const [reportData, setReportData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const generateReport = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/admin/reports/monthly?month=${selectedMonth}&year=${selectedYear}`, {
                headers: { 'x-auth-token': token || '' }
            });
            
            if (res.ok) {
                const data = await res.json();
                setReportData(data);
            } else {
                showAlert({ message: 'Failed to generate report', type: 'error' });
            }
        } catch (error) {
            console.error('Error generating report:', error);
            showAlert({ message: 'Error generating report', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = async () => {
        if (!reportData) return;
        
        setGenerating(true);
        try {
            // Dynamic import for jspdf
            const jspdfModule = await import('jspdf');
            const autotableModule = await import('jspdf-autotable');
            const jsPDF = jspdfModule.default;
            const autoTable = autotableModule.default;
            
            const doc = new jsPDF();
            
            // Header
            doc.setFontSize(18);
            doc.text('Monthly Appointment Report', 14, 20);
            doc.setFontSize(12);
            doc.text(`Month: ${new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}`, 14, 30);
            doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 36);
            
            let yPos = 45;
            
            // Summary Statistics
            doc.setFontSize(14);
            doc.text('Summary Statistics', 14, yPos);
            yPos += 8;
            
            const summaryData = [
                ['Total Appointments', reportData.summary.total.toString()],
                ['Completed', reportData.summary.completed.toString()],
                ['Cancelled', reportData.summary.cancelled.toString()],
                ['Upcoming', reportData.summary.upcoming.toString()],
                ['Completion Rate', `${reportData.summary.completionRate}%`]
            ];
            
            autoTable(doc, {
                startY: yPos,
                head: [['Metric', 'Value']],
                body: summaryData,
                theme: 'grid',
                headStyles: { fillColor: [139, 21, 56] }
            });
            
            yPos = (doc as any).lastAutoTable.finalY + 15;
            
            // Appointments by Doctor
            if (reportData.byDoctor.length > 0) {
                doc.setFontSize(14);
                doc.text('Appointments by Doctor', 14, yPos);
                yPos += 8;
                
                const doctorData = reportData.byDoctor.map((d: any) => [
                    d.doctorName,
                    d.specialty,
                    d.total.toString(),
                    d.completed.toString(),
                    d.cancelled.toString()
                ]);
                
                autoTable(doc, {
                    startY: yPos,
                    head: [['Doctor', 'Specialty', 'Total', 'Completed', 'Cancelled']],
                    body: doctorData,
                    theme: 'grid',
                    headStyles: { fillColor: [139, 21, 56] }
                });
                
                yPos = (doc as any).lastAutoTable.finalY + 15;
            }
            
            // Status Breakdown
            if (reportData.byStatus.length > 0) {
                doc.setFontSize(14);
                doc.text('Status Breakdown', 14, yPos);
                yPos += 8;
                
                const statusData = reportData.byStatus.map((s: any) => [
                    s.status.charAt(0).toUpperCase() + s.status.slice(1),
                    s.count.toString()
                ]);
                
                autoTable(doc, {
                    startY: yPos,
                    head: [['Status', 'Count']],
                    body: statusData,
                    theme: 'grid',
                    headStyles: { fillColor: [139, 21, 56] }
                });
            }
            
            doc.save(`appointment-report-${selectedYear}-${String(selectedMonth).padStart(2, '0')}.pdf`);
            showAlert({ message: 'PDF downloaded successfully', type: 'success' });
        } catch (error) {
            console.error('Error generating PDF:', error);
            showAlert({ message: 'Error generating PDF. Please install jspdf and jspdf-autotable packages.', type: 'error' });
        } finally {
            setGenerating(false);
        }
    };

    const printReport = () => {
        if (!reportData) return;
        
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Monthly Appointment Report - ${selectedYear}-${String(selectedMonth).padStart(2, '0')}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #8B1538; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #8B1538; color: white; }
                    .summary { margin: 20px 0; }
                    .section { margin: 30px 0; }
                    @media print {
                        body { padding: 0; }
                        button { display: none; }
                    }
                </style>
            </head>
            <body>
                <h1>Monthly Appointment Report</h1>
                <p><strong>Month:</strong> ${new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
                
                <div class="section">
                    <h2>Summary Statistics</h2>
                    <table>
                        <tr><th>Metric</th><th>Value</th></tr>
                        <tr><td>Total Appointments</td><td>${reportData.summary.total}</td></tr>
                        <tr><td>Completed</td><td>${reportData.summary.completed}</td></tr>
                        <tr><td>Cancelled</td><td>${reportData.summary.cancelled}</td></tr>
                        <tr><td>Upcoming</td><td>${reportData.summary.upcoming}</td></tr>
                        <tr><td>Completion Rate</td><td>${reportData.summary.completionRate}%</td></tr>
                    </table>
                </div>
                
                ${reportData.byDoctor.length > 0 ? `
                <div class="section">
                    <h2>Appointments by Doctor</h2>
                    <table>
                        <tr><th>Doctor</th><th>Specialty</th><th>Total</th><th>Completed</th><th>Cancelled</th></tr>
                        ${reportData.byDoctor.map((d: any) => `
                            <tr>
                                <td>${d.doctorName}</td>
                                <td>${d.specialty}</td>
                                <td>${d.total}</td>
                                <td>${d.completed}</td>
                                <td>${d.cancelled}</td>
                            </tr>
                        `).join('')}
                    </table>
                </div>
                ` : ''}
                
                ${reportData.byStatus.length > 0 ? `
                <div class="section">
                    <h2>Status Breakdown</h2>
                    <table>
                        <tr><th>Status</th><th>Count</th></tr>
                        ${reportData.byStatus.map((s: any) => `
                            <tr>
                                <td>${s.status.charAt(0).toUpperCase() + s.status.slice(1)}</td>
                                <td>${s.count}</td>
                            </tr>
                        `).join('')}
                    </table>
                </div>
                ` : ''}
                
                ${reportData.appointments && reportData.appointments.length > 0 ? `
                <div class="section">
                    <h2>All Appointments</h2>
                    <table>
                        <tr><th>Date</th><th>Time</th><th>Patient</th><th>Doctor</th><th>Status</th></tr>
                        ${reportData.appointments.map((apt: any) => `
                            <tr>
                                <td>${formatBDDate(apt.date)}</td>
                                <td>${apt.time}</td>
                                <td>${apt.patient_name}</td>
                                <td>${apt.doctor_name}</td>
                                <td>${apt.status}</td>
                            </tr>
                        `).join('')}
                    </table>
                </div>
                ` : ''}
                
                <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: #8B1538; color: white; border: none; cursor: pointer;">Print</button>
            </body>
            </html>
        `);
        
        printWindow.document.close();
    };

    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Page Header */}
            <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">Reports & History</h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Generate monthly reports and view appointment history</p>
            </div>

            {/* Report Generator */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">Generate Monthly Report</h2>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-stretch sm:items-end">
                    <div className="flex-1 min-w-[140px]">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Month</label>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                            className="w-full px-2 sm:px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        >
                            {months.map(month => (
                                <option key={month} value={month}>
                                    {new Date(2000, month - 1).toLocaleString('default', { month: 'long' })}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1 min-w-[140px]">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                            className="w-full px-2 sm:px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        >
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={generateReport}
                        disabled={loading}
                        className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm sm:text-base bg-primary text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-1.5 sm:gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Generating...</span>
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-base sm:text-lg">assessment</span>
                                <span>Generate Report</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Report Preview */}
            {reportData && (
                <div className="space-y-4 sm:space-y-6">
                    {/* Summary Statistics */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">Summary Statistics</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                            <div>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{reportData.summary.total}</p>
                            </div>
                            <div>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Completed</p>
                                <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">{reportData.summary.completed}</p>
                            </div>
                            <div>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Cancelled</p>
                                <p className="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400">{reportData.summary.cancelled}</p>
                            </div>
                            <div>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Upcoming</p>
                                <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{reportData.summary.upcoming}</p>
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Completion Rate</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{reportData.summary.completionRate}%</p>
                            </div>
                        </div>
                    </div>

                    {/* Appointments by Doctor */}
                    {reportData.byDoctor.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">Appointments by Doctor</h2>
                            {/* Desktop Table View */}
                            <div className="hidden lg:block overflow-x-auto -mx-4 sm:mx-0">
                                <div className="inline-block min-w-full align-middle">
                                    <div className="overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-700">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Doctor</th>
                                                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Specialty</th>
                                                    <th className="px-4 py-3 text-center text-sm font-bold text-gray-700 dark:text-gray-300">Total</th>
                                                    <th className="px-4 py-3 text-center text-sm font-bold text-gray-700 dark:text-gray-300">Completed</th>
                                                    <th className="px-4 py-3 text-center text-sm font-bold text-gray-700 dark:text-gray-300">Cancelled</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                {reportData.byDoctor.map((doctor: any, index: number) => (
                                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                        <td className="px-4 py-3 text-sm text-gray-800 dark:text-white whitespace-nowrap">{doctor.doctorName}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{doctor.specialty}</td>
                                                        <td className="px-4 py-3 text-sm text-center font-bold text-gray-800 dark:text-white">{doctor.total}</td>
                                                        <td className="px-4 py-3 text-sm text-center text-green-600 dark:text-green-400">{doctor.completed}</td>
                                                        <td className="px-4 py-3 text-sm text-center text-red-600 dark:text-red-400">{doctor.cancelled}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            {/* Mobile Card View */}
                            <div className="lg:hidden space-y-3">
                                {reportData.byDoctor.map((doctor: any, index: number) => (
                                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4 bg-gray-50 dark:bg-gray-900/50">
                                        <div className="mb-2">
                                            <h3 className="font-bold text-sm sm:text-base text-gray-800 dark:text-white">{doctor.doctorName}</h3>
                                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{doctor.specialty}</p>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 text-xs sm:text-sm">
                                            <div className="text-center">
                                                <p className="text-gray-500 dark:text-gray-400">Total</p>
                                                <p className="font-bold text-gray-800 dark:text-white">{doctor.total}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-gray-500 dark:text-gray-400">Completed</p>
                                                <p className="font-bold text-green-600 dark:text-green-400">{doctor.completed}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-gray-500 dark:text-gray-400">Cancelled</p>
                                                <p className="font-bold text-red-600 dark:text-red-400">{doctor.cancelled}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Status Breakdown */}
                    {reportData.byStatus.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">Status Breakdown</h2>
                            <div className="space-y-2 sm:space-y-3">
                                {reportData.byStatus.map((status: any, index: number) => (
                                    <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                        <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 capitalize font-medium">{status.status}</span>
                                        <span className="text-base sm:text-lg font-bold text-gray-800 dark:text-white">{status.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">Export Report</h2>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <button
                                onClick={downloadPDF}
                                disabled={generating}
                                className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm sm:text-base bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-1.5 sm:gap-2"
                            >
                                {generating ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Generating PDF...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-base sm:text-lg">download</span>
                                        <span>Download PDF</span>
                                    </>
                                )}
                            </button>
                            <button
                                onClick={printReport}
                                className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 sm:gap-2"
                            >
                                <span className="material-symbols-outlined text-base sm:text-lg">print</span>
                                <span>Print Report</span>
                            </button>
                        </div>
                        {generating && (
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2 text-center sm:text-left">
                                Generating PDF...
                            </p>
                        )}
                    </div>
                </div>
            )}

            {!reportData && !loading && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-12 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
                    <span className="material-symbols-outlined text-4xl sm:text-6xl text-gray-300 dark:text-gray-600 mb-3 sm:mb-4 block">assessment</span>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Select a month and year, then click "Generate Report" to view statistics</p>
                </div>
            )}
        </div>
    );
};

export default Reports;
