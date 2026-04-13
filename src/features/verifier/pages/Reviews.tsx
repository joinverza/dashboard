import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, Star, MoreVertical, Flag, MessageSquare, Loader2 } from "lucide-react";
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
import { bankingService, getBankingErrorMessage } from "@/services/bankingService";

export default function Reviews() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [draftReplies, setDraftReplies] = useState<Record<string, string>>({});

  const reviewsQuery = useQuery({
    queryKey: ["verifier", "reviews", searchTerm, ratingFilter],
    queryFn: () => bankingService.listVerifierReviews({ page: 1, limit: 100, search: searchTerm || undefined, rating: ratingFilter === "all" ? undefined : Number(ratingFilter) }),
  });

  const replyMutation = useMutation({
    mutationFn: ({ reviewId, message }: { reviewId: string; message: string }) => bankingService.replyVerifierReview(reviewId, message),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["verifier", "reviews"] });
    },
  });

  const reviews = reviewsQuery.data?.items ?? [];
  const average = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

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
                    {average.toFixed(1)} <Star className="h-4 w-4 fill-verza-emerald ml-1" />
                </span>
             </div>
             <div className="w-px h-4 bg-border" />
             <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Total Reviews:</span>
                <span className="font-bold">{reviews.length}</span>
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
        {reviewsQuery.isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>
        ) : reviewsQuery.error ? (
          <div className="text-sm text-red-400">{getBankingErrorMessage(reviewsQuery.error, "Failed to load reviews.")}</div>
        ) : reviews.length > 0 ? (
            reviews.map((review) => (
                <Card key={review.reviewId} className="bg-card/80 backdrop-blur-sm border-border/50">
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium">
                                    {review.reviewer.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-semibold">{review.reviewer}</h4>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span>{review.credentialType ?? "Verification"}</span>
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
                            <span>{review.helpfulCount ?? 0} people found this helpful</span>
                        </div>

                        {review.reply && (
                            <div className="bg-muted/50 p-3 rounded-md border-l-2 border-verza-emerald mt-2">
                                <div className="text-xs font-semibold text-verza-emerald mb-1">Response from you</div>
                                <p className="text-sm text-muted-foreground">{review.reply}</p>
                            </div>
                        )}

                        {!review.reply && (
                          <div className="space-y-2">
                            <Input
                              placeholder="Write a professional reply..."
                              value={draftReplies[review.reviewId] ?? ""}
                              onChange={(e) => setDraftReplies((prev) => ({ ...prev, [review.reviewId]: e.target.value }))}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2 text-xs h-8"
                              disabled={!draftReplies[review.reviewId] || replyMutation.isPending}
                              onClick={() => replyMutation.mutate({ reviewId: review.reviewId, message: draftReplies[review.reviewId] })}
                            >
                                <MessageSquare className="h-3 w-3" />
                                Submit Reply
                            </Button>
                          </div>
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
