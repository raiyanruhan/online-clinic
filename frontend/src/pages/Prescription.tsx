const Prescription = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark text-text-main font-display antialiased min-h-screen flex flex-col items-center p-8 print:p-0 print:bg-white">
            <div className="no-print w-full max-w-[800px] flex justify-end gap-4 mb-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-red-700 transition-colors" onClick={() => window.print()}>
                    <span className="material-symbols-outlined">print</span> Print
                </button>
            </div>
            
            <div className="bg-white w-full max-w-[800px] min-h-[1000px] shadow-lg rounded-sm flex flex-col overflow-hidden relative print:shadow-none print:w-full" id="prescription-container">
                {/* Header */}
                <div className="flex justify-between items-start p-8 border-b-2 border-secondary/20">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 mb-2 text-secondary">
                            <span className="material-symbols-outlined">health_and_safety</span>
                            <span className="text-xs font-bold uppercase tracking-wider">Lifecare Clinic</span>
                        </div>
                        <h2 className="text-2xl font-bold text-secondary">Dr. Sadia Afrin</h2>
                        <p className="text-sm text-gray-600 font-medium">MBBS, FCPS (Gynae & Obs)</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                        <div className="bg-secondary/10 px-3 py-1 rounded text-secondary text-xs font-bold mb-2">General Medicine</div>
                        <p className="text-xs text-gray-600"><span className="font-bold">Hotline:</span> +880 1712 345678</p>
                    </div>
                </div>

                {/* Patient Info */}
                <div className="bg-[#F8F9FA] px-8 py-4 border-b border-dashed border-gray-300 flex justify-between items-center text-sm">
                    <div className="flex gap-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Patient Name</span>
                            <span className="font-bold text-gray-900 text-lg">Mrs. Rahima Begum</span>
                        </div>
                        <div className="flex flex-col border-l border-gray-300 pl-4">
                            <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Age</span>
                            <span className="font-medium text-gray-900">32 Years</span>
                        </div>
                    </div>
                    <div className="flex flex-col text-right">
                        <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Date</span>
                        <span className="font-medium text-gray-900">24 Oct, 2023</span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-1 flex-col md:flex-row">
                    {/* Findings */}
                    <div className="w-1/3 p-8 border-r border-gray-200 bg-gray-50/30">
                        <div className="flex flex-col gap-6">
                            <div>
                                <h3 className="text-secondary text-sm font-bold uppercase tracking-wider mb-2 border-b border-gray-200 pb-1">Diagnosis</h3>
                                <p className="text-sm font-bold text-gray-900">Viral Fever</p>
                            </div>
                        </div>
                    </div>

                    {/* Rx */}
                    <div className="w-2/3 p-8">
                        <div className="mb-6 flex items-center gap-2">
                             <span className="text-4xl font-serif font-bold text-primary italic">Rx</span>
                        </div>
                        <div className="flex flex-col gap-8">
                            <div className="group">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xs font-bold text-gray-500 w-6">01.</span>
                                            <h4 className="text-lg font-bold text-gray-900">Tab. Napa Extra</h4>
                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">500mg</span>
                                        </div>
                                        <div className="ml-8 flex items-center gap-4 text-sm font-medium text-gray-800 mt-2">
                                            <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                                                <span>১ + ০ + ১</span>
                                                <span className="text-gray-400 text-xs mx-1">|</span>
                                                <span className="text-gray-600 text-xs">খাবার পর</span>
                                            </div>
                                            <span className="text-xs text-gray-500">for 5 Days</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Prescription;
