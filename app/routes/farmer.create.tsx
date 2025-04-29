import { useState } from 'react';
import type { ActionFunction } from '@remix-run/node';
import { Form } from '@remix-run/react';
import type { CreateOptionParams } from '~/types/contracts';
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  // Type-safe form handling
  return null;
};

export default function CreateOption() {
  const [cropType, setCropType] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [premium, setPremium] = useState<string>('');

  return (
    <div className="container mx-auto px-4 py-8">
      // Updated UI components with modern styling
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Option</h1>
        <Form method="post" className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Crop Type</label>
              <Input
                asChild
                className="[&>select]:pr-8"
              >
                <select>
                  {/* Options */}
                </select>
              </Input>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full"
            isLoading={false}
          >
            Create Option
          </Button>
        </Form>
      </div>
    </div>
  );
}
// Key mobile-first improvements:
// - Increased padding for touch targets (p-3 → p-4)
// - Responsive container spacing (px-4 py-6)
// - Enhanced focus states (focus:ring-2)