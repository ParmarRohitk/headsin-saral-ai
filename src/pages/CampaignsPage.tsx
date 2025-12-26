import React, { useState, useEffect } from 'react';
import { campaignApi } from '../services/api';
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import CampaignModal from '../components/CampaignModal';
import Skeleton from '../components/Skeleton';
import '../styles/CampaignsPage.css';

interface CampaignStats {
    sent: number;
    openRate: number;
    replyRate: number;
    trend: 'up' | 'down';
}

interface Campaign {
    id: number;
    name: string;
    type: 'email' | 'linkedin';
    status: 'active' | 'paused' | 'draft';
    stats: CampaignStats;
    createdAt: string;
}

const CampaignsPage: React.FC = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [activeTab, setActiveTab] = useState<'email' | 'linkedin'>('email');
    const [analytics, setAnalytics] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCampaigns = async () => {
        setIsLoading(true);
        try {
            const response = await campaignApi.getAll();
            if (response.success) {
                setCampaigns(response.data);
                if (response.data.length > 0) {
                    const analyticsRes = await campaignApi.getAnalytics(response.data[0].id);
                    setAnalytics(analyticsRes.data);
                }
            }
        } catch (error) {
            console.error('Error fetching campaigns:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const handleCreateCampaign = async (data: any) => {
        try {
            const response = await campaignApi.create(data.name, activeTab);
            if (response.success) {
                setIsModalOpen(false);
                fetchCampaigns();
            }
        } catch (error) {
            console.error('Error creating campaign:', error);
        }
    };

    const filteredCampaigns = campaigns.filter(c => c.type === activeTab);

    return (
        <div className="campaigns-page">
            <div className="stats-grid">
                {[1, 2, 3, 4].map((i: number) => (
                    isLoading ? (
                        <Skeleton key={i} height="120px" borderRadius="12px" />
                    ) : (
                        <div key={i} className="stat-card">
                            <div className="stat-header">
                                <span className="stat-title">{['Delivery Rate', 'Open Rate', 'Reply Rate', 'Total Reach'][i - 1]}</span>
                                <span className="stat-icon">{['📈', '✉️', '💬', '👥'][i - 1]}</span>
                            </div>
                            <span className="stat-value">{['98.2%', '42.5%', '12.8%', '1,240'][i - 1]}</span>
                            <div className={`stat-footer ${i === 3 ? 'trend-down' : 'trend-up'}`}>
                                <span>{i === 3 ? '↓ 0.5%' : '↑ 2.1%'}</span>
                                <span style={{ color: '#6b7280', fontWeight: 'normal' }}>vs last week</span>
                            </div>
                        </div>
                    )
                ))}
            </div>

            <div className="analytics-section">
                <div className="chart-header">
                    <h3 className="chart-title">Activity Performance {activeTab === 'email' ? '(Email)' : '(LinkedIn)'}</h3>
                    <div className="type-tag">LAST 7 DAYS</div>
                </div>
                {isLoading ? (
                    <Skeleton height="300px" borderRadius="12px" />
                ) : analytics && (
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics.dailyActivity}>
                                <defs>
                                    <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#5542f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#5542f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="sent" stroke="#5542f6" strokeWidth={2} fillOpacity={1} fill="url(#colorSent)" />
                                <Area type="monotone" dataKey="opened" stroke="#10b981" strokeWidth={2} fill="transparent" />
                                <Area type="monotone" dataKey="replied" stroke="#f59e0b" strokeWidth={2} fill="transparent" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            <div className="campaigns-content">
                <div className="campaigns-header">
                    <div className="tab-container">
                        <div
                            className={`tab ${activeTab === 'email' ? 'active' : ''}`}
                            onClick={() => setActiveTab('email')}
                        >
                            Email Sequences
                        </div>
                        <div
                            className={`tab ${activeTab === 'linkedin' ? 'active' : ''}`}
                            onClick={() => setActiveTab('linkedin')}
                        >
                            LinkedIn Campaigns
                        </div>
                    </div>
                    <button
                        className="btn-new-project"
                        style={{ padding: '10px 20px', fontSize: '14px' }}
                        onClick={() => setIsModalOpen(true)}
                    >
                        + Create Campaign
                    </button>
                </div>

                <div className="campaign-list">
                    {isLoading ? (
                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[1, 2, 3].map((i: number) => <Skeleton key={i} height="80px" borderRadius="8px" />)}
                        </div>
                    ) : (
                        filteredCampaigns.length > 0 ? filteredCampaigns.map((campaign: Campaign) => (
                            <div key={campaign.id} className="campaign-row">
                                <div className="campaign-info">
                                    <span className="campaign-name">{campaign.name}</span>
                                    <div className="campaign-type">
                                        <span className="type-tag">{campaign.type.toUpperCase()}</span>
                                        <span>• Created on {new Date(campaign.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="row-stat">
                                    <span className={`status-tag status-${campaign.status}`}>
                                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                                    </span>
                                </div>
                                <div className="row-stat">
                                    <span className="row-stat-value">{campaign.stats.sent}</span>
                                    <span className="row-stat-label">Total Sent</span>
                                </div>
                                <div className="row-stat">
                                    <span className="row-stat-value">{campaign.stats.openRate.toFixed(1)}%</span>
                                    <span className="row-stat-label">Open Rate</span>
                                </div>
                                <div className="row-stat">
                                    <span className="row-stat-value">{campaign.stats.replyRate.toFixed(1)}%</span>
                                    <span className="row-stat-label">Reply Rate</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <button className="btn-view">View details</button>
                                </div>
                            </div>
                        )) : (
                            <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                                No {activeTab} campaigns found. Create one to get started!
                            </div>
                        )
                    )}
                </div>
            </div>

            <CampaignModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleCreateCampaign}
            />
        </div>
    );
};

export default CampaignsPage;
