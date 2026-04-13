import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Save, Plus, X, Calendar, DollarSign, MapPin, Globe, FileText, Loader2 } from "lucide-react";
import { bankingService } from "@/services/bankingService";
import type { VerifierProfile as IVerifierProfile } from "@/types/banking";
import { toast } from "sonner";

export default function VerifierProfile() {
  const [profile, setProfile] = useState<IVerifierProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await bankingService.getVerifierProfile();
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("Failed to load profile data");
        // Fallback mock data for development if API fails
        setProfile({
          id: "v1",
          name: "Ontiver Professional Services",
          email: "verifier@verza.io",
          role: "verifier",
          status: "active",
          joinedAt: "2024-01-01",
          title: "Senior Identity Verifier",
          languages: ["English", "Spanish"],
          specializations: ["Corporate KYC", "Biometric Verification"],
          certifications: [
            {
              name: "Certified AML Specialist (CAMS)",
              issuer: "ACAMS",
              date: "2023-01-15",
              expiry: "2026-01-15"
            }
          ],
          pricing: [
            { type: "Identity Document", price: 5.00, expedited: 50 },
            { type: "Academic Transcript", price: 12.00, expedited: 40 }
          ],
          availability: {
            vacationMode: false,
            schedule: [
              { day: "Monday", active: true, start: "09:00", end: "17:00" },
              { day: "Tuesday", active: true, start: "09:00", end: "17:00" },
              { day: "Wednesday", active: true, start: "09:00", end: "17:00" },
              { day: "Thursday", active: true, start: "09:00", end: "17:00" },
              { day: "Friday", active: true, start: "09:00", end: "17:00" },
              { day: "Saturday", active: false, start: "09:00", end: "17:00" },
              { day: "Sunday", active: false, start: "09:00", end: "17:00" }
            ],
            timezone: "utc-5"
          },
          autoAccept: {
            enabled: false,
            minPrice: 15.00,
            allowedTypes: []
          }
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setIsSaving(true);
    try {
      await bankingService.updateVerifierProfile(profile);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-verza-emerald" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-10"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your public profile, pricing, and availability.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">View Public Profile</Button>
          <Button 
            className="bg-verza-emerald hover:bg-verza-emerald/90 text-white shadow-glow"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-card/50 backdrop-blur-sm border border-border/50 p-1">
          <TabsTrigger value="profile">Public Profile</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="auto-accept">Auto-Accept</TabsTrigger>
        </TabsList>

        {/* Public Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>This information will be displayed on your public profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex flex-col items-center gap-3">
                  <Avatar className="h-24 w-24 border-2 border-verza-emerald/50">
                    <AvatarImage src="/verifier-avatar.jpg" />
                    <AvatarFallback className="bg-verza-emerald/10 text-verza-emerald text-2xl">
                      {profile.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" className="w-full">
                    <Upload className="mr-2 h-3 w-3" /> Change
                  </Button>
                </div>
                
                <div className="grid gap-4 flex-1 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Display Name</Label>
                      <Input 
                        id="name" 
                        value={profile.name} 
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Professional Title</Label>
                      <Input 
                        id="title" 
                        value={profile.title || ""} 
                        onChange={(e) => setProfile({...profile, title: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      className="min-h-[100px]" 
                      defaultValue="Specialized in corporate identity verification with over 5 years of experience in KYC/AML compliance. Fast turnaround times and high accuracy guaranteed."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input id="location" className="pl-9" defaultValue="New York, USA" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Languages</Label>
                      <div className="space-y-2">
                        {profile.languages?.map((lang, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="relative flex-1">
                              <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-9" value={lang} readOnly />
                            </div>
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-red-500">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button variant="outline" size="sm" className="w-full border-dashed border-border text-muted-foreground hover:text-verza-emerald hover:border-verza-emerald/50">
                          <Plus className="mr-2 h-3 w-3" /> Add Language
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Specializations</Label>
                  <Button variant="ghost" size="sm" className="text-verza-emerald"><Plus className="mr-1 h-3 w-3" /> Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.specializations?.map((skill) => (
                    <Badge key={skill} variant="secondary" className="pl-2 pr-1 py-1 gap-1">
                      {skill}
                      <Button variant="ghost" size="icon" className="h-3 w-3 ml-1 hover:bg-transparent text-muted-foreground hover:text-foreground">
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Certifications</Label>
                  <Button variant="ghost" size="sm" className="text-verza-emerald"><Plus className="mr-1 h-3 w-3" /> Add Certificate</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.certifications?.map((cert, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 border border-border rounded-md bg-muted/10">
                      <div className="h-10 w-10 bg-verza-emerald/10 rounded flex items-center justify-center text-verza-emerald shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{cert.name}</h4>
                        <p className="text-xs text-muted-foreground">Issued: {cert.date} • Expires: {cert.expiry || 'N/A'}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="h-auto py-4 border-dashed border-border text-muted-foreground hover:text-verza-emerald hover:border-verza-emerald/50 flex flex-col gap-2">
                    <Upload className="h-6 w-6 opacity-50" />
                    <span>Upload Certificate</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing" className="space-y-6">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Service Pricing</CardTitle>
              <CardDescription>Set your rates for different verification types.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 mb-2 font-medium text-sm text-muted-foreground px-2">
                  <div className="col-span-5">Credential Type</div>
                  <div className="col-span-3">Base Price (USD)</div>
                  <div className="col-span-3">Expedited (+%)</div>
                  <div className="col-span-1"></div>
                </div>
                
                {profile.pricing?.map((item, i) => (
                  <div key={i} className="grid grid-cols-12 gap-4 items-center bg-muted/20 p-2 rounded-md border border-border/50">
                    <div className="col-span-5 font-medium">{item.type}</div>
                    <div className="col-span-3">
                      <div className="relative">
                        <DollarSign className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                        <Input 
                          className="pl-7 h-9" 
                          value={item.price.toString()} 
                          onChange={(e) => {
                            const newPricing = [...profile.pricing!];
                            newPricing[i] = { ...newPricing[i], price: parseFloat(e.target.value) || 0 };
                            setProfile({ ...profile, pricing: newPricing });
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-span-3">
                      <div className="relative">
                        <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">%</span>
                        <Input 
                          className="pr-7 h-9" 
                          value={item.expedited.toString()} 
                          onChange={(e) => {
                            const newPricing = [...profile.pricing!];
                            newPricing[i] = { ...newPricing[i], expedited: parseFloat(e.target.value) || 0 };
                            setProfile({ ...profile, pricing: newPricing });
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-span-1 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full border-dashed border-border text-muted-foreground hover:text-verza-emerald hover:border-verza-emerald/50">
                  <Plus className="mr-2 h-4 w-4" /> Add Pricing Tier
                </Button>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Volume Discounts</h3>
                    <p className="text-sm text-muted-foreground">Offer discounts for bulk verification requests.</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-border rounded-lg p-4 bg-muted/10">
                    <div className="text-sm font-medium mb-2">10-50 Requests</div>
                    <div className="flex items-center gap-2">
                      <Input className="w-20" defaultValue="5" />
                      <span className="text-sm text-muted-foreground">% off</span>
                    </div>
                  </div>
                  <div className="border border-border rounded-lg p-4 bg-muted/10">
                    <div className="text-sm font-medium mb-2">51-200 Requests</div>
                    <div className="flex items-center gap-2">
                      <Input className="w-20" defaultValue="10" />
                      <span className="text-sm text-muted-foreground">% off</span>
                    </div>
                  </div>
                  <div className="border border-border rounded-lg p-4 bg-muted/10">
                    <div className="text-sm font-medium mb-2">200+ Requests</div>
                    <div className="flex items-center gap-2">
                      <Input className="w-20" defaultValue="15" />
                      <span className="text-sm text-muted-foreground">% off</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Availability Tab */}
        <TabsContent value="availability" className="space-y-6">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Availability Schedule</CardTitle>
              <CardDescription>Set your working hours to manage expectations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-verza-emerald/10 flex items-center justify-center text-verza-emerald">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">Vacation Mode</div>
                    <div className="text-sm text-muted-foreground">Pause all new requests temporarily</div>
                  </div>
                </div>
                <Switch 
                  checked={profile.availability?.vacationMode}
                  onCheckedChange={(checked) => setProfile({
                    ...profile, 
                    availability: { ...profile.availability!, vacationMode: checked }
                  })}
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Weekly Schedule</h3>
                {profile.availability?.schedule.map((daySchedule, idx) => (
                  <div key={daySchedule.day} className="flex items-center gap-4">
                    <div className="w-28 font-medium">{daySchedule.day}</div>
                    <Switch 
                      checked={daySchedule.active} 
                      onCheckedChange={(checked) => {
                        const newSchedule = [...profile.availability!.schedule];
                        newSchedule[idx] = { ...newSchedule[idx], active: checked };
                        setProfile({
                          ...profile,
                          availability: { ...profile.availability!, schedule: newSchedule }
                        });
                      }}
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <Input 
                        type="time" 
                        className="w-32" 
                        value={daySchedule.start} 
                        disabled={!daySchedule.active}
                        onChange={(e) => {
                          const newSchedule = [...profile.availability!.schedule];
                          newSchedule[idx] = { ...newSchedule[idx], start: e.target.value };
                          setProfile({
                            ...profile,
                            availability: { ...profile.availability!, schedule: newSchedule }
                          });
                        }}
                      />
                      <span className="text-muted-foreground">to</span>
                      <Input 
                        type="time" 
                        className="w-32" 
                        value={daySchedule.end} 
                        disabled={!daySchedule.active}
                        onChange={(e) => {
                          const newSchedule = [...profile.availability!.schedule];
                          newSchedule[idx] = { ...newSchedule[idx], end: e.target.value };
                          setProfile({
                            ...profile,
                            availability: { ...profile.availability!, schedule: newSchedule }
                          });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-border/50">
                <h3 className="font-medium mb-4">Time Zone</h3>
                <Select 
                  value={profile.availability?.timezone} 
                  onValueChange={(value) => setProfile({
                    ...profile, 
                    availability: { ...profile.availability!, timezone: value }
                  })}
                >
                  <SelectTrigger className="w-full md:w-[400px]">
                    <SelectValue placeholder="Select time zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc-8">Pacific Time (UTC-08:00)</SelectItem>
                    <SelectItem value="utc-5">Eastern Time (UTC-05:00)</SelectItem>
                    <SelectItem value="utc+0">UTC (UTC+00:00)</SelectItem>
                    <SelectItem value="utc+1">Central European Time (UTC+01:00)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Auto-Accept Tab */}
        <TabsContent value="auto-accept" className="space-y-6">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Auto-Accept Settings</CardTitle>
              <CardDescription>Automatically accept jobs that meet your criteria.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable Auto-Accept</Label>
                  <p className="text-sm text-muted-foreground">Automatically accept jobs matching criteria below</p>
                </div>
                <Switch 
                  checked={profile.autoAccept?.enabled}
                  onCheckedChange={(checked) => setProfile({
                    ...profile,
                    autoAccept: { ...profile.autoAccept!, enabled: checked }
                  })}
                />
              </div>

              <div className={`grid gap-6 ${!profile.autoAccept?.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="space-y-3">
                  <Label>Minimum Price Threshold</Label>
                  <div className="relative w-full md:w-[300px]">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      className="pl-9" 
                      value={profile.autoAccept?.minPrice.toString()} 
                      onChange={(e) => setProfile({
                        ...profile,
                        autoAccept: { ...profile.autoAccept!, minPrice: parseFloat(e.target.value) || 0 }
                      })}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Jobs offering less than this amount will require manual acceptance.</p>
                </div>

                <div className="space-y-3">
                  <Label>Allowed Credential Types</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {["Identity Documents", "Academic Records", "Employment History", "Financial Data", "Medical Records", "Legal Documents"].map((type) => (
                      <div key={type} className="flex items-center space-x-2 border border-border rounded-md p-3">
                        <Switch 
                          id={`type-${type}`}
                          checked={profile.autoAccept?.allowedTypes?.includes(type)}
                          onCheckedChange={(checked) => {
                            const currentTypes = profile.autoAccept?.allowedTypes || [];
                            let newTypes;
                            if (checked) {
                              newTypes = [...currentTypes, type];
                            } else {
                              newTypes = currentTypes.filter(t => t !== type);
                            }
                            setProfile({
                              ...profile,
                              autoAccept: { ...profile.autoAccept!, allowedTypes: newTypes }
                            });
                          }}
                        />
                        <Label htmlFor={`type-${type}`}>{type}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
