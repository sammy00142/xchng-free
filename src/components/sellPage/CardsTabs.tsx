import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CardsTabs() {
  return (
    <Tabs defaultValue="account" className="bg-white rounded-2xl my-8">
      <TabsList className="grid w-full grid-cols-2 bg-white">
        <TabsTrigger value="account">Most Recent</TabsTrigger>
        <TabsTrigger value="password">All</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Most Popular</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2"></CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>All</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2"></CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
