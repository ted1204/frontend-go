import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { getJobs } from '../services/jobService';
import PageBreadcrumb from '../components/common/PageBreadCrumb';
const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const data = await getJobs();
                setJobs(data);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
            }
            finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);
    return (_jsxs(_Fragment, { children: [_jsx(PageBreadcrumb, { pageTitle: "Jobs" }), _jsx("div", { className: "rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1", children: _jsx("div", { className: "max-w-full overflow-x-auto", children: _jsxs("table", { className: "w-full table-auto", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-gray-2 text-left dark:bg-meta-4", children: [_jsx("th", { className: "min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11", children: "Job Name" }), _jsx("th", { className: "min-w-[150px] py-4 px-4 font-medium text-black dark:text-white", children: "Namespace" }), _jsx("th", { className: "min-w-[120px] py-4 px-4 font-medium text-black dark:text-white", children: "Status" }), _jsx("th", { className: "py-4 px-4 font-medium text-black dark:text-white", children: "Created At" })] }) }), _jsx("tbody", { children: loading ? (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "text-center py-4", children: "Loading..." }) })) : error ? (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "text-center py-4 text-red-500", children: error }) })) : jobs.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "text-center py-4", children: "No jobs found" }) })) : (jobs.map((job) => (_jsxs("tr", { children: [_jsx("td", { className: "border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11", children: _jsx("h5", { className: "font-medium text-black dark:text-white", children: job.Name }) }), _jsx("td", { className: "border-b border-[#eee] py-5 px-4 dark:border-strokedark", children: _jsx("p", { className: "text-black dark:text-white", children: job.Namespace }) }), _jsx("td", { className: "border-b border-[#eee] py-5 px-4 dark:border-strokedark", children: _jsx("p", { className: `inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${job.Status === 'Succeeded'
                                                    ? 'bg-success text-success'
                                                    : job.Status === 'Failed'
                                                        ? 'bg-danger text-danger'
                                                        : 'bg-warning text-warning'}`, children: job.Status }) }), _jsx("td", { className: "border-b border-[#eee] py-5 px-4 dark:border-strokedark", children: _jsx("p", { className: "text-black dark:text-white", children: new Date(job.CreatedAt).toLocaleString() }) })] }, job.ID)))) })] }) }) })] }));
};
export default Jobs;
