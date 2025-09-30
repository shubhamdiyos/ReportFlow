import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  Download, 
  Plus, 
  Settings, 
  Crown, 
  Check, 
  X, 
  Calendar,
  DollarSign,
  Trash2,
  Edit3,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Users,
  FileText,
  Database,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { 
  mockBillingData, 
  mockSubscriptionPlans, 
  mockCurrentSubscription, 
  mockPaymentMethods, 
  mockInvoices 
} from "@/lib/mock-data";
import { SubscriptionPlan, PaymentMethod, Invoice, CurrentSubscription } from "@/lib/types";
import { paymentMethodSchema, PaymentMethodForm } from "@shared/schema";
import { cn } from "@/lib/utils";

interface PlanChangeData {
  planId: string;
  planName: string;
  currentPlan: string;
  isUpgrade: boolean;
  newPrice: number;
  oldPrice: number;
}

export default function Billing() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showPlanChangeDialog, setShowPlanChangeDialog] = useState(false);
  const [planChangeData, setPlanChangeData] = useState<PlanChangeData | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [showDeletePaymentDialog, setShowDeletePaymentDialog] = useState(false);
  const [showCancelSubscriptionDialog, setShowCancelSubscriptionDialog] = useState(false);
  
  // Dynamic state management for billing data
  const [currentSubscription, setCurrentSubscription] = useState<CurrentSubscription>({ ...mockCurrentSubscription });
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([...mockSubscriptionPlans]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([...mockPaymentMethods]);
  const [invoices, setInvoices] = useState<Invoice[]>([...mockInvoices]);
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>(currentSubscription.interval as 'monthly' | 'yearly');
  
  // Form for adding payment method with validation
  const paymentForm = useForm<PaymentMethodForm>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvc: "",
      holderName: ""
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getCardIcon = (brand: string) => {
    const icons = {
      visa: "💳",
      mastercard: "💳", 
      amex: "💳",
      discover: "💳"
    };
    return icons[brand as keyof typeof icons] || "💳";
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-500 text-white",
      cancelled: "bg-red-500 text-white",
      past_due: "bg-yellow-500 text-white",
      trialing: "bg-blue-500 text-white",
      paid: "bg-green-500 text-white",
      pending: "bg-yellow-500 text-white",
      overdue: "bg-red-500 text-white",
      failed: "bg-red-500 text-white"
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || "bg-gray-500 text-white"}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </Badge>
    );
  };

  const handlePlanChange = (plan: SubscriptionPlan) => {
    const currentPlan = availablePlans.find(p => p.interval === billingInterval && p.price === currentSubscription.amount) || availablePlans[0];
    const targetPlan = availablePlans.find(p => p.id === plan.id && p.interval === billingInterval) || plan;
    const isUpgrade = targetPlan.price > currentSubscription.amount;
    setPlanChangeData({
      planId: targetPlan.id,
      planName: targetPlan.name,
      currentPlan: currentSubscription.planName,
      isUpgrade,
      newPrice: targetPlan.price,
      oldPrice: currentSubscription.amount
    });
    setShowPlanChangeDialog(true);
  };

  const handleConfirmPlanChange = async () => {
    if (!planChangeData) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update current subscription state
      const newPlan = availablePlans.find(p => p.id === planChangeData.planId && p.interval === billingInterval);
      if (newPlan) {
        const nextBillingDate = new Date();
        nextBillingDate.setMonth(nextBillingDate.getMonth() + (billingInterval === 'yearly' ? 12 : 1));
        
        setCurrentSubscription(prev => ({
          ...prev,
          planId: newPlan.id,
          planName: newPlan.name,
          amount: newPlan.price,
          nextBillingDate: nextBillingDate.toISOString(),
          interval: billingInterval
        }));
      }
      
      toast({
        title: `Plan ${planChangeData.isUpgrade ? 'Upgraded' : 'Downgraded'}`,
        description: `Successfully switched to ${planChangeData.planName} plan.`,
      });
      
      setShowPlanChangeDialog(false);
      setPlanChangeData(null);
    } catch (error) {
      toast({
        title: "Plan Change Failed",
        description: "There was an error changing your plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPaymentMethod = async (data: PaymentMethodForm) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create new payment method
      const newPaymentMethod: PaymentMethod = {
        id: `pm_${Date.now()}`,
        type: "card",
        brand: data.cardNumber.startsWith('4') ? 'visa' : data.cardNumber.startsWith('5') ? 'mastercard' : 'visa',
        last4: data.cardNumber.replace(/\s/g, '').slice(-4),
        expiryMonth: parseInt(data.expiryMonth),
        expiryYear: parseInt(data.expiryYear),
        isDefault: paymentMethods.length === 0, // First card becomes default
        holderName: data.holderName
      };
      
      // Add to payment methods state
      setPaymentMethods(prev => [...prev, newPaymentMethod]);
      
      toast({
        title: "Payment Method Added",
        description: "Your new payment method has been added successfully.",
      });
      
      paymentForm.reset();
      setShowPaymentDialog(false);
    } catch (error) {
      toast({
        title: "Payment Method Failed",
        description: "There was an error adding your payment method.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePaymentMethod = async () => {
    if (!selectedPaymentMethod) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove from payment methods state
      setPaymentMethods(prev => {
        const updated = prev.filter(pm => pm.id !== selectedPaymentMethod.id);
        // If we deleted the default card and there are other cards, make the first one default
        if (selectedPaymentMethod.isDefault && updated.length > 0) {
          updated[0].isDefault = true;
        }
        return updated;
      });
      
      toast({
        title: "Payment Method Removed",
        description: "Payment method has been removed successfully.",
      });
      
      setShowDeletePaymentDialog(false);
      setSelectedPaymentMethod(null);
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description: "There was an error removing the payment method.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadInvoice = async (invoice: Invoice) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        title: "Invoice Downloaded",
        description: `Invoice ${invoice.number} has been downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error downloading the invoice.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefaultPaymentMethod = async (paymentMethodId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update payment methods state to set new default
      setPaymentMethods(prev => prev.map(pm => ({
        ...pm,
        isDefault: pm.id === paymentMethodId
      })));
      
      toast({
        title: "Default Payment Method Updated",
        description: "Payment method has been set as your default.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was an error updating the default payment method.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update subscription to cancel at period end
      setCurrentSubscription(prev => ({
        ...prev,
        cancelAtPeriodEnd: true,
        status: 'active' // Still active until period end
      }));
      
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription will be cancelled at the end of the current billing period.",
      });
      
      setShowCancelSubscriptionDialog(false);
    } catch (error) {
      toast({
        title: "Cancellation Failed",
        description: "There was an error cancelling your subscription.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResumeSubscription = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update subscription to resume
      setCurrentSubscription(prev => ({
        ...prev,
        cancelAtPeriodEnd: false,
        status: 'active'
      }));
      
      toast({
        title: "Subscription Resumed",
        description: "Your subscription has been reactivated and will continue.",
      });
    } catch (error) {
      toast({
        title: "Resume Failed",
        description: "There was an error resuming your subscription.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleIntervalChange = (newInterval: 'monthly' | 'yearly') => {
    setBillingInterval(newInterval);
    // Update available plans to show prices for the selected interval
    // This would typically trigger a recalculation of plan prices
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-8"
      data-testid="billing-page"
    >
      {/* Page Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3 leading-tight">
            <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
            <span>Billing & Subscription</span>
          </h1>
          <p className="text-muted-foreground mt-2">Manage your subscription and payment methods</p>
        </div>
      </div>

      {/* Current Plan Status */}
      <Card data-testid="card-current-plan">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-2xl font-bold" data-testid="text-current-plan-name">{currentSubscription.planName}</span>
                <div className="flex items-center gap-2">
                  {getStatusBadge(currentSubscription.status)}
                  {currentSubscription.cancelAtPeriodEnd && (
                    <Badge variant="outline" className="text-xs text-yellow-600 px-2 py-1" data-testid="badge-cancellation-pending">
                      Cancels {formatDate(currentSubscription.currentPeriodEnd)}
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground" data-testid="text-current-plan-price">
                {formatCurrency(currentSubscription.amount)} per {currentSubscription.interval}
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm font-medium">Next Billing Date</span>
              </div>
              <p className="text-sm text-muted-foreground ml-6" data-testid="text-next-billing-date">
                {formatDate(currentSubscription.nextBillingDate)}
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm font-medium">Billing Period</span>
              </div>
              <p className="text-sm text-muted-foreground ml-6" data-testid="text-billing-period">
                {formatDate(currentSubscription.currentPeriodStart)} - {formatDate(currentSubscription.currentPeriodEnd)}
              </p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-2 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Subscription Status</span>
                  {currentSubscription.cancelAtPeriodEnd ? (
                    <ToggleRight className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                  ) : (
                    <ToggleLeft className="w-4 h-4 text-green-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {currentSubscription.cancelAtPeriodEnd ? 
                    "Will cancel at period end" : 
                    "Active and renewing"
                  }
                </p>
              </div>
              {currentSubscription.cancelAtPeriodEnd ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleResumeSubscription}
                  disabled={isLoading}
                  className="h-9 px-3 flex items-center justify-center flex-shrink-0"
                  data-testid="button-resume-subscription"
                >
                  Resume Subscription
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowCancelSubscriptionDialog(true)}
                  className="h-9 px-3 flex items-center justify-center flex-shrink-0"
                  data-testid="button-cancel-subscription"
                >
                  Cancel Subscription
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Plans */}
      <Card data-testid="card-subscription-plans">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Available Plans</CardTitle>
              <p className="text-sm text-muted-foreground">Choose the plan that best fits your needs</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Billing Cycle:</span>
              <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                <Button
                  variant={billingInterval === 'monthly' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleIntervalChange('monthly')}
                  className="h-8 px-3 flex items-center justify-center"
                  data-testid="button-billing-monthly"
                >
                  Monthly
                </Button>
                <Button
                  variant={billingInterval === 'yearly' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleIntervalChange('yearly')}
                  className="h-8 px-3 flex items-center justify-center"
                  data-testid="button-billing-yearly"
                >
                  Yearly
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {availablePlans.filter(plan => plan.interval === billingInterval).map((plan) => {
              const isCurrent = plan.id === currentSubscription.planId && plan.interval === currentSubscription.interval;
              
              return (
                <div
                  key={plan.id}
                  className={cn(
                    "relative rounded-lg border p-6 hover:shadow-md transition-shadow",
                    plan.popular && "border-primary shadow-md",
                    isCurrent && "bg-muted/50"
                  )}
                  data-testid={`card-plan-${plan.id}`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  )}
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>
                    
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">{formatCurrency(plan.price)}</span>
                      <span className="text-sm text-muted-foreground">/{plan.interval}</span>
                    </div>
                    
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      variant={isCurrent ? "outline" : "default"}
                      className="w-full h-10 flex items-center justify-center gap-2"
                      disabled={isCurrent || isLoading}
                      onClick={() => handlePlanChange(plan)}
                      data-testid={`button-select-plan-${plan.id}`}
                    >
                      {isCurrent ? (
                        <>
                          <Crown className="w-4 h-4" />
                          <span>Current Plan</span>
                        </>
                      ) : plan.price > currentSubscription.amount ? (
                        <>
                          <ArrowUpRight className="w-4 h-4" />
                          <span>Upgrade to {plan.name}</span>
                        </>
                      ) : (
                        <>
                          <ArrowDownRight className="w-4 h-4" />
                          <span>Downgrade to {plan.name}</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card data-testid="card-payment-methods">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Payment Methods</CardTitle>
            <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
              <DialogTrigger asChild>
                <Button 
                  size="sm" 
                  className="h-9 px-3 flex items-center justify-center gap-2" 
                  data-testid="button-add-payment-method"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Card</span>
                </Button>
              </DialogTrigger>
              <DialogContent data-testid="dialog-add-payment-method">
                <DialogHeader>
                  <DialogTitle>Add Payment Method</DialogTitle>
                  <DialogDescription>
                    Add a new credit or debit card to your account
                  </DialogDescription>
                </DialogHeader>
                <Form {...paymentForm}>
                  <form onSubmit={paymentForm.handleSubmit(handleAddPaymentMethod)} className="space-y-4">
                    <FormField
                      control={paymentForm.control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Card Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="1234 5678 9012 3456"
                              {...field}
                              data-testid="input-card-number"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={paymentForm.control}
                        name="expiryMonth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Month</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-expiry-month">
                                  <SelectValue placeholder="MM" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Array.from({ length: 12 }, (_, i) => (
                                  <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                    {String(i + 1).padStart(2, '0')}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={paymentForm.control}
                        name="expiryYear"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Year</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-expiry-year">
                                  <SelectValue placeholder="YYYY" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Array.from({ length: 10 }, (_, i) => (
                                  <SelectItem key={i} value={String(new Date().getFullYear() + i)}>
                                    {new Date().getFullYear() + i}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={paymentForm.control}
                        name="cvc"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CVC</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="123"
                                maxLength={4}
                                {...field}
                                data-testid="input-cvc"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={paymentForm.control}
                      name="holderName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cardholder Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe"
                              {...field}
                              data-testid="input-holder-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3">
                      <Button 
                        type="button"
                        variant="outline" 
                        onClick={() => {
                          paymentForm.reset();
                          setShowPaymentDialog(false);
                        }}
                        className="h-10 px-4 flex items-center justify-center"
                        data-testid="button-cancel-payment-method"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        disabled={isLoading}
                        className="h-10 px-4 flex items-center justify-center"
                        data-testid="button-save-payment-method"
                      >
                        {isLoading ? "Adding..." : "Add Card"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between p-4 border rounded-lg"
                data-testid={`card-payment-method-${method.id}`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getCardIcon(method.brand)}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {method.brand.toUpperCase()} ****{method.last4}
                      </span>
                      {method.isDefault && (
                        <Badge variant="outline" className="text-xs">Default</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Expires {method.expiryMonth}/{method.expiryYear} • {method.holderName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!method.isDefault && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleSetDefaultPaymentMethod(method.id)}
                      disabled={isLoading}
                      data-testid={`button-set-default-payment-method-${method.id}`}
                    >
                      <Crown className="w-4 h-4" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    data-testid={`button-edit-payment-method-${method.id}`}
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setSelectedPaymentMethod(method);
                      setShowDeletePaymentDialog(true);
                    }}
                    disabled={method.isDefault || paymentMethods.length === 1}
                    data-testid={`button-delete-payment-method-${method.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card data-testid="card-billing-history">
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <p className="text-sm text-muted-foreground">Download invoices and view payment history</p>
        </CardHeader>
        <CardContent>
          <Table data-testid="table-billing-history">
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id} data-testid={`row-invoice-${invoice.id}`}>
                  <TableCell className="font-medium">{invoice.number}</TableCell>
                  <TableCell>{formatDate(invoice.date)}</TableCell>
                  <TableCell>{formatCurrency(invoice.amount, invoice.currency)}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell>{invoice.paymentMethod || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadInvoice(invoice)}
                      disabled={isLoading}
                      data-testid={`button-download-invoice-${invoice.id}`}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Plan Change Confirmation Dialog */}
      <AlertDialog open={showPlanChangeDialog} onOpenChange={setShowPlanChangeDialog}>
        <AlertDialogContent data-testid="dialog-plan-change-confirmation">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {planChangeData?.isUpgrade ? 'Upgrade' : 'Downgrade'} Subscription
            </AlertDialogTitle>
            <AlertDialogDescription>
              {planChangeData?.isUpgrade ? (
                <>
                  You're upgrading from <strong>{planChangeData.currentPlan}</strong> to <strong>{planChangeData.planName}</strong>.
                  Your next billing amount will be {formatCurrency(planChangeData.newPrice)} per month.
                </>
              ) : planChangeData ? (
                <>
                  You're downgrading from <strong>{planChangeData.currentPlan}</strong> to <strong>{planChangeData.planName}</strong>.
                  Your next billing amount will be {formatCurrency(planChangeData.newPrice)} per month.
                  Changes will take effect at the end of your current billing period.
                </>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-plan-change">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmPlanChange} 
              disabled={isLoading}
              data-testid="button-confirm-plan-change"
            >
              {isLoading ? 'Processing...' : `Confirm ${planChangeData?.isUpgrade ? 'Upgrade' : 'Downgrade'}`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Payment Method Confirmation Dialog */}
      <AlertDialog open={showDeletePaymentDialog} onOpenChange={setShowDeletePaymentDialog}>
        <AlertDialogContent data-testid="dialog-delete-payment-method-confirmation">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Payment Method</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this payment method? This action cannot be undone.
              {selectedPaymentMethod && (
                <div className="mt-2 p-2 bg-muted rounded">
                  {selectedPaymentMethod.brand.toUpperCase()} ****{selectedPaymentMethod.last4}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete-payment-method">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeletePaymentMethod} 
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete-payment-method"
            >
              {isLoading ? 'Removing...' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Subscription Confirmation Dialog */}
      <AlertDialog open={showCancelSubscriptionDialog} onOpenChange={setShowCancelSubscriptionDialog}>
        <AlertDialogContent data-testid="dialog-cancel-subscription-confirmation">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your subscription? Your subscription will remain active until the end of your current billing period on {formatDate(currentSubscription.currentPeriodEnd)}.
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <div className="text-sm">
                  <strong>Current Plan:</strong> {currentSubscription.planName}<br/>
                  <strong>Next Billing Date:</strong> {formatDate(currentSubscription.nextBillingDate)}<br/>
                  <strong>Amount:</strong> {formatCurrency(currentSubscription.amount)}
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                You can reactivate your subscription at any time before the cancellation takes effect.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-subscription-cancel">
              Keep Subscription
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancelSubscription} 
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-subscription-cancel"
            >
              {isLoading ? 'Cancelling...' : 'Cancel Subscription'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}