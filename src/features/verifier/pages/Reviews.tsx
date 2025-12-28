import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Star, MoreVertical, Flag, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock Reviews Data
const REVIEWS = [
    {
        id: 1,
        user: "Alice M.",
        rating: 5,
        date: "2024-05-10",
        credentialType: "Education Verification",
        comment: "Very fast and professional verification. Highly recommended! The verifier was very thorough.",
        reply: "Thank you Alice! Glad to help.",
        helpful: 12
    },
    {
        id: 2,
        user: "Tech Corp Inc.",
        rating: 4,
        date: "2024-05-08",
        credentialType: "Employment Check",
        comment: "Good service, but took slightly longer than expected due to timezone differences.",
        reply: null,
        helpful: 3
    },
    {
        id: 3,
        user: "John D.",
        rating: 5,
        date: "2024-05-01",
        credentialType: "Identity Verification",
        comment: "Excellent attention to detail. Process was smooth.",
        reply: null,
        helpful: 5
    },
    {
        id: 4,
        user: "Sarah L.",
        rating: 3,
        date: "2024-04-28",
        credentialType: "Professional License",
        comment: "Verification was accurate but communication could be better.",
        reply: null,
        helpful: 1
    },
    {
        id: 5,
        user: "Global Logistics",
        rating: 5,
        date: "2024-04-25",
        credentialType: "Business Verification",
        comment: "Top notch service. Will use again.",
        reply: "Appreciate the business!",
        helpful: 8
    }
];

export default function Reviews() {
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");

  const filteredReviews = REVIEWS.filter(review => {
    const matchesSearch = review.comment.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          review.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === "all" || review.rating.toString() === ratingFilter;
    return matchesSearch && matchesRating;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Reviews</h1>
          <p className="text-muted-foreground">Manage and respond to your verification reviews.</p>
        </div>
        <div className="flex items-center gap-4 text-sm bg-card/50 px-4 py-2 rounded-lg border border-border/50">
             <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Average Rating:</span>
                <span className="font-bold text-verza-emerald flex items-center">
                    4.4 <Star className="h-4 w-4 fill-verza-emerald ml-1" />
                </span>
             </div>
             <div className="w-px h-4 bg-border" />
             <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Total Reviews:</span>
                <span className="font-bold">128</span>
             </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search reviews..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Rating" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
        </Select>
      </div>

      {/* Reviews List */}
      <div className="grid gap-6">
        {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
                <Card key={review.id} className="bg-card/80 backdrop-blur-sm border-border/50">
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium">
                                    {review.user.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-semibold">{review.user}</h4>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                        <span>{review.date}</span>
                                        <span>•</span>
                                        <span>{review.credentialType}</span>
                                    </div>
                                </div>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Reply</DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-500">
                                        <Flag className="mr-2 h-4 w-4" /> Report
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${i < review.rating ? 'fill-verza-emerald text-verza-emerald' : 'text-muted'}`} 
                                />
                            ))}
                        </div>
                        <p className="text-sm">{review.comment}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{review.helpful} people found this helpful</span>
                        </div>

                        {review.reply && (
                            <div className="bg-muted/50 p-3 rounded-md border-l-2 border-verza-emerald mt-2">
                                <div className="text-xs font-semibold text-verza-emerald mb-1">Response from you</div>
                                <p className="text-sm text-muted-foreground">{review.reply}</p>
                            </div>
                        )}

                        {!review.reply && (
                            <Button variant="outline" size="sm" className="gap-2 text-xs h-8">
                                <MessageSquare className="h-3 w-3" />
                                Reply to Review
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ))
        ) : (
            <div className="text-center py-12 text-muted-foreground">
                <p>No reviews found matching your criteria.</p>
            </div>
        )}
      </div>
    </motion.div>
  );
}
