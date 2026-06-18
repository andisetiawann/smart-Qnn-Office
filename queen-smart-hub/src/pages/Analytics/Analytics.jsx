import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { supabase } from '../../services/supabaseClient';

export const Analytics = () => {
  const [dailyData, setDailyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [stats, setStats] = useState({
    peak: '0%',
    peakTime: '00:00',
    average: '0%',
    total: '0 W'
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        // Sesuaikan nama tabel 'daily_usage', 'weekly_usage', 'monthly_usage' 
        // dengan yang ada di database Supabase Anda.
        const { data: daily } = await supabase.from('daily_usage').select('*').order('id', { ascending: true });
        if (daily) setDailyData(daily);

        const { data: weekly } = await supabase.from('weekly_usage').select('*').order('id', { ascending: true });
        if (weekly) setWeeklyData(weekly);

        const { data: monthly } = await supabase.from('monthly_usage').select('*').order('id', { ascending: true });
        if (monthly) setMonthlyData(monthly);

        const { data: summary } = await supabase.from('usage_stats').select('*').single();
        if (summary) setStats(summary);
      } catch (error) {
        console.error('Error fetching data from Supabase:', error);
      }
    };

    fetchAnalyticsData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 md:p-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">Analyze your device usage patterns</p>
        </motion.div>

        <motion.div variants={itemVariants} className="card-base mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Daily Usage</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #0A66FF',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="usage"
                stroke="#0A66FF"
                strokeWidth={3}
                dot={{ fill: '#0A66FF', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={itemVariants} className="card-base mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Weekly Usage Comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #0A66FF',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="devices" fill="#0A66FF" radius={[8, 8, 0, 0]} />
              <Bar dataKey="energy" fill="#E53935" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={itemVariants} className="card-base mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly Usage Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #0A66FF',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="usage"
                stroke="#0A66FF"
                strokeWidth={3}
                dot={{ fill: '#0A66FF', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-base">
            <h3 className="font-semibold text-gray-700 mb-3">Today's Peak</h3>
            <p className="text-3xl font-bold text-primary mb-1">{stats.peak}</p>
            <p className="text-sm text-gray-600">Peak usage at {stats.peakTime}</p>
          </div>
          <div className="card-base">
            <h3 className="font-semibold text-gray-700 mb-3">This Week Average</h3>
            <p className="text-3xl font-bold text-primary mb-1">{stats.average}</p>
            <p className="text-sm text-gray-600">Average daily usage</p>
          </div>
          <div className="card-base">
            <h3 className="font-semibold text-gray-700 mb-3">This Month Total</h3>
            <p className="text-3xl font-bold text-primary mb-1">{stats.total}</p>
            <p className="text-sm text-gray-600">Estimated consumption</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
