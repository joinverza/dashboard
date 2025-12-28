import { motion } from "framer-motion";
import { Star, Award, TrendingUp, MessageSquare, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: { color: '#9ca3af' }
    },
  },
  scales: {
    y: {
      grid: { color: 'rgba(255, 255, 255, 0.1)' },
      ticks: { color: '#9ca3af' }
    },
    x: {
      grid: { color: 'rgba(255, 255, 255, 0.1)' },
      ticks: { color: '#9ca3af' }
    }
  }
};

const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Reputation Score',
      data: [4.2, 4.3, 4.5, 4.6, 4.8, 4.9],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.5)',
      tension: 0.4,
    },
  ],
};

const REVIEWS = [
    {
        id: 1,
        user: "Alice M.",
        rating: 5,
        date: "2 days ago",
        comment: "Very fast and professional verification. Highly recommended!",
        tags: ["Fast", "Professional"]
    },
    {
        id: 2,
        user: "Tech Corp",
        rating: 4,
        date: "1 week ago",
        comment: "Good service, but took slightly longer than expected.",
        tags: ["Accurate"]
    },
    {
        id: 3,
        user: "John D.",
        rating: 5,
        date: "2 weeks ago",
        comment: "Excellent attention to detail.",
        tags: ["Detailed", "Friendly"]
    }
];

export default function Reputation() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Reputation Dashboard</h1>
          <p className="text-muted-foreground">Monitor your performance and community standing.</p>
        </div>
        <Button className="bg-verza-emerald hover:bg-verza-emerald/90 text-white shadow-glow">
            View Public Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Score Card */}
        <Card className="md:col-span-1 bg-card/80 backdrop-blur-sm border-border/50 flex flex-col justify-center items-center p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Award className="h-32 w-32" />
            </div>
            <div className="text-center z-10">
                <h3 className="text-muted-foreground font-medium mb-2">Overall Score</h3>
                <div className="text-6xl font-bold text-verza-emerald mb-2">4.9</div>
                <div className="flex justify-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-5 w-5 fill-verza-emerald text-verza-emerald" />
                    ))}
                </div>
                <Badge variant="outline" className="bg-verza-emerald/10 text-verza-emerald border-verza-emerald/20">
                    Top 5% Verifier
                </Badge>
            </div>
        </Card>

        {/* Breakdown */}
        <Card className="md:col-span-2 bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
                <CardTitle>Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Accuracy</span>
                        <span className="font-bold">99%</span>
                    </div>
                    <Progress value={99} className="h-2" />
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Speed</span>
                        <span className="font-bold">95%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Communication</span>
                        <span className="font-bold">4.8/5.0</span>
                    </div>
                    <Progress value={96} className="h-2" />
                </div>
                 <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Professionalism</span>
                        <span className="font-bold">5.0/5.0</span>
                    </div>
                    <Progress value={100} className="h-2" />
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Trend Chart */}
         <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-verza-emerald" />
                    Reputation Trend
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full flex items-center justify-center">
                    <Line options={options} data={data} />
                </div>
            </CardContent>
         </Card>

         {/* Recent Reviews Preview */}
         <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                    Recent Reviews
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => window.location.href='/verifier/reviews'}>
                    View All
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {REVIEWS.map(review => (
                    <div key={review.id} className="border-b border-border/50 last:border-0 pb-4 last:pb-0">
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-medium">{review.user}</span>
                            <span className="text-xs text-muted-foreground">{review.date}</span>
                        </div>
                        <div className="flex gap-0.5 mb-2">
                            {[...Array(5)].map((_, i) => (
                                <Star 
                                    key={i} 
                                    className={`h-3 w-3 ${i < review.rating ? 'fill-verza-emerald text-verza-emerald' : 'text-muted'}`} 
                                />
                            ))}
                        </div>
                        <p className="text-sm text-muted-foreground italic">"{review.comment}"</p>
                    </div>
                ))}
            </CardContent>
         </Card>
      </div>
      
       {/* AI Suggestions */}
       <Card className="bg-gradient-to-br from-verza-purple/10 to-transparent border-verza-purple/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-verza-purple">
                    <AlertCircle className="h-5 w-5" />
                    AI Improvement Tips
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Try to reduce verification time during peak hours (9 AM - 11 AM) to improve your Speed score.</li>
                    <li>Adding a personalized note to completed verifications can boost Communication ratings.</li>
                    <li>You are in the top 10% for Accuracy! Keep up the good work.</li>
                </ul>
            </CardContent>
       </Card>
    </motion.div>
  );
}
