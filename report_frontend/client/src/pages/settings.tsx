import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/shared/theme-provider";
import { 
  Save, 
  Upload, 
  Settings as SettingsIcon, 
  Globe, 
  Moon, 
  Sun,
  Download
} from "lucide-react";

interface SettingsData {
  orgName: string;
  themeColor: string;
  logoUrl?: string;
  defaultReportType: string;
  defaultReportPeriod: string;
  defaultLayout: string;
  summaryTone: string;
  timezone: string;
  emailNotifications: boolean;
  slackNotifications: boolean;
  teamsNotifications: boolean;
  retentionPeriod: string;
  darkMode: boolean;
}

export default function Settings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  
  // Settings state
  const [settings, setSettings] = useState<SettingsData>({
    orgName: "Acme Corp",
    themeColor: "#3b82f6",
    defaultReportType: "productivity",
    defaultReportPeriod: "weekly",
    defaultLayout: "executive",
    summaryTone: "professional",
    timezone: "America/New_York",
    emailNotifications: true,
    slackNotifications: false,
    teamsNotifications: false,
    retentionPeriod: "12",
    darkMode: false
  });

  const { theme, setTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load settings from localStorage only once on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  // Sync theme changes separately to avoid overwriting unsaved edits
  useEffect(() => {
    setSettings(prev => ({ ...prev, darkMode: theme === 'dark' }));
  }, [theme]);

  const isValidHex = (hex: string) => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  };

  const handleSettingChange = (key: keyof SettingsData, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
    
    // Handle theme change through ThemeProvider
    if (key === 'darkMode') {
      setTheme(value ? 'dark' : 'light');
    }
  };

  const handleLogoUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoDataUrl = e.target?.result as string;
        setSettings(prev => ({ ...prev, logoUrl: logoDataUrl }));
        setIsDirty(true);
        toast({
          title: "Logo Uploaded",
          description: `${file.name} has been uploaded successfully.`,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExportData = () => {
    const dataToExport = {
      settings,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `settings-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data Exported",
      description: "Your settings have been exported successfully.",
    });
  };

  const handleSaveSettings = async () => {
    // Validate theme color before saving
    if (settings.themeColor && !isValidHex(settings.themeColor)) {
      toast({
        title: "Invalid Theme Color",
        description: "Please enter a valid hex color (e.g., #3b82f6).",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save settings to localStorage (excluding darkMode as it's handled by ThemeProvider)
      const { darkMode, ...settingsToSave } = settings;
      localStorage.setItem('appSettings', JSON.stringify(settingsToSave));
      
      setIsDirty(false);
      toast({
        title: "Settings Saved",
        description: "Your organization settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving your settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const timezones = [
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "UTC", label: "UTC" },
    { value: "Europe/London", label: "London (GMT)" },
    { value: "Europe/Paris", label: "Paris (CET)" },
    { value: "Asia/Tokyo", label: "Tokyo (JST)" },
    { value: "Asia/Singapore", label: "Singapore (SGT)" },
    { value: "Australia/Sydney", label: "Sydney (AEDT)" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6"
      data-testid="settings-page"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <SettingsIcon className="w-8 h-8" />
            Settings
          </h1>
          <p className="text-muted-foreground">Manage your organization preferences and integrations</p>
        </div>
        <div className="flex items-center gap-3">
          {isDirty && (
            <Badge variant="outline" className="text-yellow-700 border-yellow-300 bg-yellow-50 dark:text-yellow-400 dark:border-yellow-600 dark:bg-yellow-950">
              Unsaved Changes
            </Badge>
          )}
          <Button 
            onClick={handleSaveSettings}
            disabled={!isDirty || isLoading}
            data-testid="button-save-settings"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Preferences */}
      <Card data-testid="card-preferences">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            General Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="default-report-type">Default Report Type</Label>
              <Select 
                value={settings.defaultReportType} 
                onValueChange={(value) => handleSettingChange('defaultReportType', value)}
              >
                <SelectTrigger data-testid="select-default-report-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="productivity">Productivity Report</SelectItem>
                  <SelectItem value="performance">Performance Analysis</SelectItem>
                  <SelectItem value="security">Security Review</SelectItem>
                  <SelectItem value="collaboration">Collaboration Summary</SelectItem>
                  <SelectItem value="custom">Custom Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="default-period">Default Report Period</Label>
              <Select 
                value={settings.defaultReportPeriod} 
                onValueChange={(value) => handleSettingChange('defaultReportPeriod', value)}
              >
                <SelectTrigger data-testid="select-default-period">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="timezone" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Timezone
            </Label>
            <Select 
              value={settings.timezone} 
              onValueChange={(value) => handleSettingChange('timezone', value)}
            >
              <SelectTrigger data-testid="select-timezone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dark-mode" className="text-base font-medium flex items-center gap-2">
                {settings.darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                Dark Mode
              </Label>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark themes
              </p>
            </div>
            <Switch 
              id="dark-mode" 
              checked={settings.darkMode}
              onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
              data-testid="switch-dark-mode" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Organization Branding */}
      <Card data-testid="card-branding">
        <CardHeader>
          <CardTitle>Organization Branding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="org-name">Organization Name</Label>
            <Input 
              id="org-name" 
              value={settings.orgName}
              onChange={(e) => handleSettingChange('orgName', e.target.value)}
              placeholder="Your Organization" 
              data-testid="input-org-name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="org-logo">Logo Upload</Label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                {settings.logoUrl ? (
                  <img 
                    src={settings.logoUrl} 
                    alt="Organization logo" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Upload className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                data-testid="input-logo-file"
              />
              <Button 
                variant="outline" 
                onClick={handleLogoUpload}
                data-testid="button-upload-logo"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Logo
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="theme-color">Theme Color</Label>
            <div className="flex items-center gap-4">
              <div 
                className="w-8 h-8 rounded border" 
                style={{ backgroundColor: isValidHex(settings.themeColor) ? settings.themeColor : '#3b82f6' }}
              />
              <Input 
                id="theme-color" 
                value={settings.themeColor}
                onChange={(e) => handleSettingChange('themeColor', e.target.value)}
                placeholder="#3b82f6" 
                className="max-w-32"
                data-testid="input-theme-color"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Templates */}
      <Card data-testid="card-report-templates">
        <CardHeader>
          <CardTitle>Report Templates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="report-layout">Default Layout</Label>
            <Select 
              value={settings.defaultLayout} 
              onValueChange={(value) => handleSettingChange('defaultLayout', value)}
            >
              <SelectTrigger data-testid="select-report-layout">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="executive">Executive Summary</SelectItem>
                <SelectItem value="detailed">Detailed Analysis</SelectItem>
                <SelectItem value="brief">Brief Overview</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="summary-tone">Summary Tone</Label>
            <Select 
              value={settings.summaryTone} 
              onValueChange={(value) => handleSettingChange('summaryTone', value)}
            >
              <SelectTrigger data-testid="select-summary-tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card data-testid="card-notifications">
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications" className="text-base font-medium">
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive report updates via email
              </p>
            </div>
            <Switch 
              id="email-notifications" 
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
              data-testid="switch-email-notifications" 
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="slack-notifications" className="text-base font-medium">
                Slack Integration
              </Label>
              <p className="text-sm text-muted-foreground">
                Send reports to Slack channels
              </p>
            </div>
            <Switch 
              id="slack-notifications" 
              checked={settings.slackNotifications}
              onCheckedChange={(checked) => handleSettingChange('slackNotifications', checked)}
              data-testid="switch-slack-notifications" 
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="teams-notifications" className="text-base font-medium">
                Microsoft Teams
              </Label>
              <p className="text-sm text-muted-foreground">
                Send reports to Teams channels
              </p>
            </div>
            <Switch 
              id="teams-notifications" 
              checked={settings.teamsNotifications}
              onCheckedChange={(checked) => handleSettingChange('teamsNotifications', checked)}
              data-testid="switch-teams-notifications" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Retention */}
      <Card data-testid="card-data-retention">
        <CardHeader>
          <CardTitle>Data Retention</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="retention-period">Report Retention Period</Label>
            <Select 
              value={settings.retentionPeriod} 
              onValueChange={(value) => handleSettingChange('retentionPeriod', value)}
            >
              <SelectTrigger data-testid="select-retention-period">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 months</SelectItem>
                <SelectItem value="6">6 months</SelectItem>
                <SelectItem value="12">12 months</SelectItem>
                <SelectItem value="24">24 months</SelectItem>
                <SelectItem value="indefinite">Indefinite</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="data-export">Data Export</Label>
            <Button 
              variant="outline" 
              onClick={handleExportData}
              data-testid="button-export-data"
            >
              <Download className="w-4 h-4 mr-2" />
              Export All Data
            </Button>
            <p className="text-sm text-muted-foreground">
              Download all your organization's data in JSON format
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
