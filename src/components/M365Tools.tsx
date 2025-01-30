import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Building2, Mail, Globe, Signal, AtSign, Copy, Check, ExternalLink } from 'lucide-react';

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={copyToClipboard}
      className="h-8 w-8 hover:bg-slate-100"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );
};

const TenantLookup = () => {
  const [email, setEmail] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const lookupTenant = async () => {
    setLoading(true);
    setError('');
    try {
      // This is where you would make the actual API call
      // For demo purposes, we'll simulate a response
      const domain = email.split('@')[1];
      const response = await fetch(`https://login.microsoftonline.com/${domain}/v2.0/.well-known/openid-configuration`);
      const data = await response.json();
      const tenantId = data.issuer.split('/')[3];
      setTenantId(tenantId);
    } catch (err) {
      setError('Unable to find tenant ID. Please verify the email domain.');
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Tenant ID Lookup
        </CardTitle>
        <CardDescription>
          Find the Microsoft 365 tenant ID using an email address
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button onClick={lookupTenant} disabled={!email || loading}>
              {loading ? 'Looking up...' : 'Lookup'}
            </Button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {tenantId && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Tenant ID:</p>
              <div className="flex items-center gap-2">
                <p className="font-mono mt-1 flex-1">{tenantId}</p>
                <CopyButton text={tenantId} />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const UPNGenerator = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [domain, setDomain] = useState('');
  const [generatedUPN, setGeneratedUPN] = useState('');

  const generateUPN = () => {
    if (!firstName || !lastName || !domain) return;
    
    const cleanFirstName = firstName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanLastName = lastName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const upn = `${cleanFirstName}.${cleanLastName}@${domain}`;
    setGeneratedUPN(upn);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AtSign className="h-5 w-5" />
          UPN Generator
        </CardTitle>
        <CardDescription>
          Generate User Principal Name (UPN) for new users
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <Input
            placeholder="Domain (e.g., contoso.com)"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
          <Button onClick={generateUPN} disabled={!firstName || !lastName || !domain}>
            Generate UPN
          </Button>
          {generatedUPN && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Generated UPN:</p>
              <div className="flex items-center gap-2">
                <p className="font-mono mt-1 flex-1">{generatedUPN}</p>
                <CopyButton text={generatedUPN} />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const ServiceStatus = () => {
  const [serviceUrl, setServiceUrl] = useState('');
  
  const services = [
    {
      name: 'Microsoft 365 Service Health',
      url: 'https://admin.microsoft.com/Adminportal/Home#/servicehealth'
    },
    {
      name: 'Azure Status',
      url: 'https://status.azure.com'
    },
    {
      name: 'Office 365 Status',
      url: 'https://portal.office.com/servicestatus'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Signal className="h-5 w-5" />
          Service Status Dashboard
        </CardTitle>
        <CardDescription>
          Quick access to Microsoft service health dashboards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {services.map((service) => (
            <a
              key={service.url}
              href={service.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium">{service.name}</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const DomainChecker = () => {
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState<any>(null);

  const checkDomain = async () => {
    try {
      const cleanDomain = domain.trim().toLowerCase();
      const mxResult = await fetch(`https://dns.google/resolve?name=${cleanDomain}&type=MX`);
      const mxData = await mxResult.json();
      
      const spfResult = await fetch(`https://dns.google/resolve?name=${cleanDomain}&type=TXT`);
      const spfData = await spfResult.json();
      
      const dkimSelector = '_domainkey';
      const dkimResult = await fetch(`https://dns.google/resolve?name=${dkimSelector}.${cleanDomain}&type=TXT`);
      const dkimData = await dkimResult.json();

      setResults({
        hasMX: mxData.Answer && mxData.Answer.length > 0,
        hasSPF: spfData.Answer && spfData.Answer.some((record: any) => record.data.includes('v=spf1')),
        hasDKIM: dkimData.Answer && dkimData.Answer.length > 0
      });
    } catch (error) {
      console.error('Error checking domain:', error);
      setResults({
        error: 'Failed to check domain records. Please try again.'
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Domain DNS Checker
        </CardTitle>
        <CardDescription>
          Check domain DNS records for Microsoft 365 setup
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter domain (e.g., contoso.com)"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="flex-1"
            />
            <Button onClick={checkDomain} disabled={!domain}>
              Check Records
            </Button>
          </div>
          
          {results && !results.error && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg ${results.hasMX ? 'bg-green-50' : 'bg-red-50'}`}>
                  <p className="font-medium">MX Records</p>
                  <p className={`text-sm ${results.hasMX ? 'text-green-600' : 'text-red-600'}`}>
                    {results.hasMX ? 'Found' : 'Not Found'}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${results.hasSPF ? 'bg-green-50' : 'bg-red-50'}`}>
                  <p className="font-medium">SPF Record</p>
                  <p className={`text-sm ${results.hasSPF ? 'text-green-600' : 'text-red-600'}`}>
                    {results.hasSPF ? 'Found' : 'Not Found'}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${results.hasDKIM ? 'bg-green-50' : 'bg-red-50'}`}>
                  <p className="font-medium">DKIM Record</p>
                  <p className={`text-sm ${results.hasDKIM ? 'text-green-600' : 'text-red-600'}`}>
                    {results.hasDKIM ? 'Found' : 'Not Found'}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {results?.error && (
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-red-600">{results.error}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const M365Tools = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Microsoft 365 Tools</h1>
          <p className="text-gray-600 mb-8">A collection of useful tools for Microsoft 365 administrators</p>
          
          <Tabs defaultValue="tenant-lookup" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
              <TabsTrigger value="tenant-lookup">Tenant Lookup</TabsTrigger>
              <TabsTrigger value="upn-generator">UPN Generator</TabsTrigger>
              <TabsTrigger value="service-status">Service Status</TabsTrigger>
              <TabsTrigger value="domain-checker">Domain Checker</TabsTrigger>
            </TabsList>

            <TabsContent value="tenant-lookup">
              <TenantLookup />
            </TabsContent>

            <TabsContent value="upn-generator">
              <UPNGenerator />
            </TabsContent>

            <TabsContent value="service-status">
              <ServiceStatus />
            </TabsContent>

            <TabsContent value="domain-checker">
              <DomainChecker />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default M365Tools;