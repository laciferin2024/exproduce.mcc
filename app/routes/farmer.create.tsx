import { useState } from 'react';
import type { ActionFunction } from '@remix-run/node';
import { Form } from '@remix-run/react';
import type { CreateOptionParams } from '~/types/contracts';

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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Option</h1>
      <Form method="post" className="space-y-4">
        <div>
          <label htmlFor="cropType" className="block mb-2">Crop Type</label>
          <select
            id="cropType"
            name="cropType"
            value={cropType}
            onChange={(e) => setCropType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Crop</option>
            <option value="Wheat">Wheat</option>
            <option value="Rice">Rice</option>
            <option value="Cotton">Cotton</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="quantity" className="block mb-2">Quantity (kg)</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Option
        </button>
      </Form>
    </div>
  );
}