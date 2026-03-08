import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

jest.mock('@/lib/api/ordersApi', () => ({
  downloadOrder: jest.fn(),
}));

import { downloadOrder } from '@/lib/api/ordersApi';
import { DownloadButton } from '@/components/orders/DownloadButton';

const mockDownloadOrder = downloadOrder as jest.Mock;

describe('DownloadButton', () => {
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;

  beforeEach(() => {
    URL.createObjectURL = jest.fn(() => 'blob:http://localhost/test');
    URL.revokeObjectURL = jest.fn();
    jest.clearAllMocks();
  });

  afterEach(() => {
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
  });

  it('renders a download button', () => {
    render(<DownloadButton orderId="order-1" token="test-token" />);
    expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
  });

  it('calls downloadOrder with correct params on click', async () => {
    mockDownloadOrder.mockResolvedValue(new Blob(['data'], { type: 'text/csv' }));
    render(<DownloadButton orderId="order-1" token="test-token" />);
    fireEvent.click(screen.getByRole('button', { name: /download/i }));
    await waitFor(() => {
      expect(mockDownloadOrder).toHaveBeenCalledWith('order-1', 'test-token');
    });
  });

  it('creates a blob URL and revokes it after download', async () => {
    mockDownloadOrder.mockResolvedValue(new Blob(['data'], { type: 'text/csv' }));
    render(<DownloadButton orderId="order-1" token="test-token" />);
    fireEvent.click(screen.getByRole('button', { name: /download/i }));
    await waitFor(() => {
      expect(URL.createObjectURL).toHaveBeenCalled();
      expect(URL.revokeObjectURL).toHaveBeenCalled();
    });
  });

  it('shows error message when download fails', async () => {
    mockDownloadOrder.mockRejectedValue(new Error('Download failed'));
    render(<DownloadButton orderId="order-1" token="test-token" />);
    fireEvent.click(screen.getByRole('button', { name: /download/i }));
    await waitFor(() => {
      expect(screen.getByText(/error|failed|download failed/i)).toBeInTheDocument();
    });
  });

  it('shows loading state while downloading', async () => {
    let resolveDownload: (value: Blob) => void;
    mockDownloadOrder.mockImplementation(
      () => new Promise<Blob>((resolve) => { resolveDownload = resolve; })
    );
    render(<DownloadButton orderId="order-1" token="test-token" />);
    fireEvent.click(screen.getByRole('button', { name: /download/i }));
    expect(screen.getByRole('button')).toBeDisabled();
    resolveDownload!(new Blob(['data']));
    await waitFor(() => {
      expect(screen.getByRole('button')).not.toBeDisabled();
    });
  });
});
