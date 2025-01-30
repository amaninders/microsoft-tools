'use client'

import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Building2, Mail, FileCheck, Users2, Copy, Check } from 'lucide-react';

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

const LicenseLookup = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCheck className="h-5 w-5" />
          License Status Check
        </CardTitle>
        <CardDescription>
          Check Microsoft 365 license status for a user
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">Feature coming soon...</p>
      </CardContent>
    </Card>
  );
};

const GroupMembershipTool = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users2 className="h-5 w-5" />
          Group Membership Tool
        </CardTitle>
        <CardDescription>
          Check user's group memberships across Microsoft 365
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">Feature coming soon...</p>
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
            <TabsList>
              <TabsTrigger value="tenant-lookup">Tenant Lookup</TabsTrigger>
              <TabsTrigger value="license-check">License Check</TabsTrigger>
              <TabsTrigger value="group-tool">Group Tool</TabsTrigger>
            </TabsList>

            <TabsContent value="tenant-lookup">
              <TenantLookup />
            </TabsContent>

            <TabsContent value="license-check">
              <LicenseLookup />
            </TabsContent>

            <TabsContent value="group-tool">
              <GroupMembershipTool />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default M365Tools;