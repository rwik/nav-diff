
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MutualFundCombobox } from "./MutualFundCombobox";
import { ArrowDown, ArrowUp, AlertTriangle, Percent } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface NAVData {
  schemeCode: string;
  schemeName: string;
  nav: string;
  date: string;
}

export function NavDiffCalculator() {
  const [currentNav, setCurrentNav] = useState<number | null>(null);
  const [userNav, setUserNav] = useState<number | null>(null);
  const [percentageDiff, setPercentageDiff] = useState<number | null>(null);
  const [schemeCode, setSchemeCode] = useState<string>(""); // Default scheme code
  const [fundName, setFundName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [navDate, setNavDate] = useState<string>("");
  const { toast } = useToast();

  // Fetch the current NAV for the selected fund
  useEffect(() => {
    const fetchNAV = async () => {
      if (!schemeCode) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`https://api.mfapi.in/mf/${schemeCode}`);
       // const response = await fetch(`https://api.mfapi.in/mf/120823/latest`);
        if (!response.ok) {
          throw new Error("Failed to fetch NAV data");
        }
        
        const data = await response.json();
        
        if (data && data.data && data.data.length > 0) {
          const latestNav = parseFloat(data.data[0].nav);
          setCurrentNav(latestNav);
          setNavDate(data.data[0].date);
          setFundName(data.meta.scheme_name);
          
          // Calculate percentage difference if user NAV exists
          if (userNav !== null) {
            calculateDifference(latestNav, userNav);
          }
        } else {
          throw new Error("No NAV data found");
        }
      } catch (error) {
        console.error("Error fetching NAV data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch the latest NAV data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNAV();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schemeCode]);

  // Handle fund selection
  const handleFundSelect = (newSchemeCode: string) => {
    setSchemeCode(newSchemeCode);
  };

  // Handle user NAV input change
  const handleUserNavChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      setUserNav(value);
      if (currentNav !== null) {
        calculateDifference(currentNav, value);
      }
    } else {
      setUserNav(null);
      setPercentageDiff(null);
    }
  };

  // Calculate the percentage difference
  const calculateDifference = (current: number, user: number) => {
    const diff = ((user - current)  / current) * 100;
    setPercentageDiff(parseFloat(diff.toFixed(2)));
  };

  // Determine if user should invest more (difference > 5%)
  const shouldInvestMore = percentageDiff !== null && percentageDiff < -5;
   console.log(percentageDiff)
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">NAV Diff</CardTitle>
        <CardDescription className="text-center">
          Compare your NAV with the current market NAV
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="fund-select">Select Mutual Fund</Label>
          <MutualFundCombobox onFundSelect={handleFundSelect} />
        </div>

        {isLoading ? (
          <div className="py-4 text-center">Loading NAV data...</div>
        ) : (
          <>
            {currentNav !== null && (
              <div className="space-y-2">
                <Label>Current NAV</Label>
                <div className="flex items-center p-3 bg-secondary rounded-md">
                  <span className="text-xl font-medium">₹{currentNav.toFixed(2)}</span>
                  <span className="ml-auto text-sm text-muted-foreground">{navDate}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{fundName}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="user-nav">Your NAV</Label>
              <Input
                id="user-nav"
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter your NAV"
                onChange={handleUserNavChange}
              />
            </div>

            {percentageDiff !== null && (
              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Difference:</span>
                  <div
                    className={`flex items-center space-x-1 font-bold ${
                      percentageDiff >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {percentageDiff >= 0 ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                    <span>{Math.abs(percentageDiff)}%</span>
                    <Percent className="h-4 w-4" />
                  </div>
                </div>

                {shouldInvestMore && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-sm">
                      The NAV has decresed by more than 5%. Consider investing more to maximize your returns.
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
