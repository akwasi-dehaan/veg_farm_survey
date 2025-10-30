import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Youth Vegetable Farming Survey
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A comprehensive survey to understand youth engagement in vegetable
            farming, their challenges, aspirations, and the support they need to
            succeed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/survey">
              <Button variant="primary" className="w-full sm:w-auto">
                Start New Survey
              </Button>
            </Link>
            {/* <Link href="/dashboard">
              <Button variant="outline" className="w-full sm:w-auto">
                View Dashboard
              </Button>
            </Link> */}
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Comprehensive Data Collection
              </h3>
              <p className="text-gray-600">
                Gather detailed information about farming practices, challenges,
                and aspirations from youth farmers.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Offline Capability
              </h3>
              <p className="text-gray-600">
                Works without internet connection. Data syncs automatically when
                connection is restored.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Data Export
              </h3>
              <p className="text-gray-600">
                Export survey data in multiple formats for analysis and
                reporting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
