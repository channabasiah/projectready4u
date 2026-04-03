import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL;

const humanizeKey = (key) =>
  key
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');

export default function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');
  const storedUsername = localStorage.getItem('adminUsername') || '';

  const [activeTab, setActiveTab] = useState('leads');
  const [leads, setLeads] = useState([]);
  const [content, setContent] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [citySort, setCitySort] = useState(''); // '', 'asc', 'desc'
  const [reachedFilter, setReachedFilter] = useState('all'); // 'all', 'pending', 'reached'
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const authenticatedHeaders = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    if (!token) {
      navigate('/admin');
      return;
    }

    const fetchLeads = async () => {
      setLoadingLeads(true);
      try {
        const response = await axios.get(`${API_URL}/api/leads`, { headers: authenticatedHeaders });
        setLeads(response.data.leads || []);
      } catch (err) {
        console.error(err);
        setErrorMessage('Failed to load leads');
      } finally {
        setLoadingLeads(false);
      }
    };

    const fetchContent = async () => {
      setLoadingContent(true);
      try {
        const response = await axios.get(`${API_URL}/api/content`);
        setContent(response.data.content || {});
      } catch (err) {
        console.error(err);
        setErrorMessage('Failed to load content');
      } finally {
        setLoadingContent(false);
      }
    };

    fetchLeads();
    fetchContent();
  }, [token, navigate]);

  const filteredLeads = useMemo(() => {
    const query = searchTerm.toLowerCase();

    let result = leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(query) ||
        lead.city.toLowerCase().includes(query);

      const matchesReached =
        reachedFilter === 'all' ||
        (reachedFilter === 'pending' && !lead.reached) ||
        (reachedFilter === 'reached' && lead.reached);

      return matchesSearch && matchesReached;
    });

    if (citySort === 'asc') {
      result = result.slice().sort((a, b) => a.city.localeCompare(b.city));
    } else if (citySort === 'desc') {
      result = result.slice().sort((a, b) => b.city.localeCompare(a.city));
    }

    return result;
  }, [leads, searchTerm, citySort, reachedFilter]);

  const totalLeads = filteredLeads.length;

  const todayLeads = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return leads.filter((lead) => lead.created_at?.startsWith(today)).length;
  }, [leads]);

  const handleUpdateContent = async (key, value) => {
    try {
      await axios.put(`${API_URL}/api/content`, { key, value }, { headers: authenticatedHeaders });
      setContent((prev) => ({ ...prev, [key]: value }));
      setStatusMessage(`Saved ${humanizeKey(key)}`);
      setTimeout(() => setStatusMessage(''), 2500);
    } catch (err) {
      console.error(err);
      setErrorMessage('Content update failed');
      setTimeout(() => setErrorMessage(''), 2500);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    navigate('/admin');
  };

  const openLeadDetails = (lead) => {
    setSelectedLead(lead);
    setIsDetailModalOpen(true);
  };

  const closeLeadDetails = () => {
    setSelectedLead(null);
    setIsDetailModalOpen(false);
  };

  const updateReachedStatus = async (leadId, reached) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/leads/${leadId}/reached`,
        { reached },
        { headers: authenticatedHeaders }
      );
      setLeads((prev) => prev.map((lead) => (lead.id === leadId ? { ...lead, reached } : lead)));
      setStatusMessage(response.data.message || 'Reached status updated');
      setTimeout(() => setStatusMessage(''), 2500);
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to update reached status');
      setTimeout(() => setErrorMessage(''), 2500);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Student ID', 'Name', 'Phone', 'WhatsApp', 'Email', 'College', 'City', 'Project Title', 'Reached', 'Date'];
    const rows = filteredLeads.map((lead) => [
      lead.student_code || '',
      lead.name,
      lead.phone,
      lead.whatsapp,
      lead.email,
      lead.college,
      lead.city,
      lead.project_title || '',
      lead.reached ? 'Yes' : 'No',
      new Date(lead.created_at).toLocaleString(),
    ]);
    const csvContent = [headers, ...rows].map((row) => row.map((col) => `"${col || ''}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'projectready4u_leads.csv');
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex flex-col md:flex-row">
        <aside className="w-full md:w-60 bg-slate-900 border-r border-slate-800 p-4">
          <h2 className="text-2xl font-bold mb-4">ProjectReady4U</h2>
          <div className="space-y-2">
            <button onClick={() => setActiveTab('leads')} className={`w-full text-left py-2 px-3 rounded-lg ${activeTab === 'leads' ? 'bg-indigo-600' : 'hover:bg-slate-700'}`}>
              Student Leads
            </button>
            <button onClick={() => setActiveTab('content')} className={`w-full text-left py-2 px-3 rounded-lg ${activeTab === 'content' ? 'bg-indigo-600' : 'hover:bg-slate-700'}`}>
              Edit Website Content
            </button>
            <button onClick={() => setActiveTab('account')} className={`w-full text-left py-2 px-3 rounded-lg ${activeTab === 'account' ? 'bg-indigo-600' : 'hover:bg-slate-700'}`}>
              Account
            </button>
          </div>
        </aside>

        <main className="flex-1 p-6">
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-800 rounded-xl shadow-sm">
              <h3 className="text-sm text-slate-400">Total Leads</h3>
              <p className="text-3xl font-bold">{totalLeads}</p>
            </div>
            <div className="p-4 bg-slate-800 rounded-xl shadow-sm">
              <h3 className="text-sm text-slate-400">Today's Leads</h3>
              <p className="text-3xl font-bold">{todayLeads}</p>
            </div>
          </div>

          {statusMessage && <p className="mb-3 p-2 bg-emerald-500/20 text-emerald-100 rounded">{statusMessage}</p>}
          {errorMessage && <p className="mb-3 p-2 bg-red-500/20 text-red-100 rounded">{errorMessage}</p>}

          <AnimatePresence mode="wait">
            {activeTab === 'leads' && (
              <motion.section
                key="leads"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-slate-900/80 p-5 rounded-2xl shadow-xl"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name or city"
                      className="px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={() => setCitySort((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                      className="py-2 px-4 bg-yellow-500 hover:bg-yellow-400 rounded-lg text-black font-semibold"
                    >
                      Sort City: {citySort === 'asc' ? 'A→Z' : citySort === 'desc' ? 'Z→A' : 'None'}
                    </button>
                    <button
                      onClick={() => setReachedFilter('all')}
                      className={`py-2 px-4 rounded-lg ${reachedFilter === 'all' ? 'bg-green-500 text-black' : 'bg-slate-700 text-white'}`}>
                      All
                    </button>
                    <button
                      onClick={() => setReachedFilter('pending')}
                      className={`py-2 px-4 rounded-lg ${reachedFilter === 'pending' ? 'bg-yellow-500 text-black' : 'bg-slate-700 text-white'}`}>
                      Pending
                    </button>
                    <button
                      onClick={() => setReachedFilter('reached')}
                      className={`py-2 px-4 rounded-lg ${reachedFilter === 'reached' ? 'bg-emerald-500 text-black' : 'bg-slate-700 text-white'}`}>
                      Reached
                    </button>
                  </div>
                  <button onClick={handleExportCSV} className="py-2 px-4 bg-indigo-600 hover:bg-indigo-500 rounded-lg">Export CSV</button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-xs uppercase text-slate-400 border-b border-slate-700">
                        <th className="py-2 px-3">Student ID</th>
                        <th className="py-2 px-3">Name</th>
                        <th className="py-2 px-3">Phone</th>
                        <th className="py-2 px-3">Email</th>
                        <th className="py-2 px-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingLeads ? (
                        <tr>
                          <td colSpan="7" className="py-4 text-center">Loading leads...</td>
                        </tr>
                      ) : filteredLeads.length > 0 ? (
                        filteredLeads.map((lead, index) => (
                          <tr key={lead.id} className="border-b border-slate-800 hover:bg-slate-800">
                            <td className="py-2 px-3">{lead.student_code || '-'}</td>
                            <td className="py-2 px-3">{lead.name}</td>
                            <td className="py-2 px-3">{lead.phone}</td>
                            <td className="py-2 px-3">{lead.email}</td>
                            <td className="py-2 px-3 flex gap-2">
                              <button
                                onClick={() => openLeadDetails(lead)}
                                className="px-3 py-1 rounded-lg bg-blue-500 hover:bg-blue-400 text-white"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() => updateReachedStatus(lead.id, !lead.reached)}
                                className={`px-3 py-1 rounded-lg ${lead.reached ? 'bg-emerald-500 text-black' : 'bg-yellow-500 text-black'}`}
                              >
                                {lead.reached ? 'Mark Pending' : 'Mark Reached'}
                              </button>
                              <button
                                onClick={async () => {
                                  if (window.confirm(`Delete ${lead.name}?`)) {
                                    try {
                                      await axios.delete(`${API_URL}/api/leads/${lead.id}`, { headers: authenticatedHeaders });
                                      setLeads((prev) => prev.filter((x) => x.id !== lead.id));
                                      setStatusMessage('Student deleted');
                                      setTimeout(() => setStatusMessage(''), 2000);
                                    } catch (err) {
                                      console.error(err);
                                      setErrorMessage('Delete failed');
                                      setTimeout(() => setErrorMessage(''), 2000);
                                    }
                                  }
                                }}
                                className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="5" className="py-4 text-center">No leads found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {isDetailModalOpen && selectedLead && (
                  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full p-6">
                      <h3 className="text-xl font-bold mb-4">Lead Details</h3>
                      <div className="grid grid-cols-2 gap-3 text-sm text-slate-100">
                        <div className="font-semibold text-slate-300">Student ID:</div>
                        <div>{selectedLead.student_code || '-'}</div>
                        <div className="font-semibold text-slate-300">Name:</div>
                        <div>{selectedLead.name}</div>
                        <div className="font-semibold text-slate-300">Phone:</div>
                        <div>{selectedLead.phone}</div>
                        <div className="font-semibold text-slate-300">WhatsApp:</div>
                        <div>{selectedLead.whatsapp}</div>
                        <div className="font-semibold text-slate-300">Email:</div>
                        <div>{selectedLead.email}</div>
                        <div className="font-semibold text-slate-300">College:</div>
                        <div>{selectedLead.college}</div>
                        <div className="font-semibold text-slate-300">City:</div>
                        <div>{selectedLead.city}</div>
                        <div className="font-semibold text-slate-300">Project:</div>
                        <div>{selectedLead.project_title || '-'}</div>
                        <div className="font-semibold text-slate-300">Reached:</div>
                        <div>{selectedLead.reached ? 'Yes' : 'No'}</div>
                        <div className="font-semibold text-slate-300">Student ID:</div>
                        <div>{selectedLead.student_code || '-'}</div>
                        <div className="font-semibold text-slate-300">Date:</div>
                        <div>{new Date(selectedLead.created_at).toLocaleString()}</div>
                      </div>
                      <div className="mt-5 flex justify-end gap-2">
                        <button onClick={closeLeadDetails} className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600">Close</button>
                      </div>
                    </div>
                  </div>
                )}

              </motion.section>
            )}

            {activeTab === 'content' && (
              <motion.section
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-slate-900/80 p-5 rounded-2xl shadow-xl"
              >
                {loadingContent ? (
                  <p>Loading content...</p>
                ) : (
                  <div className="space-y-4">
                    {Object.keys(content).map((key) => (
                      <div key={key} className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <label className="block mb-2 text-sm text-slate-300">{humanizeKey(key)}</label>
                        <div className="flex flex-col md:flex-row items-start gap-2">
                          {key === 'what_included_text' ? (
                            <textarea
                              className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 resize-vertical min-h-[100px]"
                              value={content[key]}
                              onChange={(e) => setContent((prev) => ({ ...prev, [key]: e.target.value }))}
                              placeholder="Enter each bullet point on a new line"
                            />
                          ) : (
                            <input
                              className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
                              value={content[key]}
                              onChange={(e) => setContent((prev) => ({ ...prev, [key]: e.target.value }))}
                            />
                          )}
                          <button
                            onClick={() => handleUpdateContent(key, content[key])}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.section>
            )}

            {activeTab === 'account' && (
              <motion.section
                key="account"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-slate-900/80 p-5 rounded-2xl shadow-xl"
              >
                <h3 className="text-2xl font-semibold mb-4">Account</h3>
                <p className="mb-2">Logged in as <strong>{storedUsername}</strong></p>
                <button onClick={handleLogout} className="py-2 px-4 rounded-lg bg-red-600 hover:bg-red-500">
                  Logout
                </button>
              </motion.section>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
