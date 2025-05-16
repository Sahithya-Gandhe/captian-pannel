import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <Card className="w-full max-w-md shadow-xl bg-white rounded-2xl p-6">
        <CardContent>
          <h1 className="text-2xl font-semibold text-blue-700 mb-6 text-center">
            Login
          </h1>
          <form className="space-y-5">
            <div>
              <Label htmlFor="mobile" className="text-blue-700">
                Mobile No.
              </Label>
              <Input
                id="mobile"
                type="tel"
                placeholder="Enter your mobile number"
                className="mt-1 border-blue-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-blue-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="mt-1 border-blue-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;