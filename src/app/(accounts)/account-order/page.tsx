"use client";

import { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import Prices from "@/components/Prices";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import Image from "next/image";
import { useSaleorAuthContext } from "@saleor/auth-sdk/react";
import { useRouter } from "next/navigation";

// GraphQL query for user orders
const GET_USER_ORDERS = gql`
  query GetUserOrders($after: String, $first: Int = 10) {
    me {
      orders(after: $after, first: $first) {
        edges {
          node {
            id
            number
            created
            status
            total {
              gross {
                amount
                currency
              }
            }
            shippingAddress {
              firstName
              lastName
              streetAddress1
              city
              country {
                country
              }
            }
            lines {
              id
              quantity
              totalPrice {
                gross {
                  amount
                  currency
                }
              }
              variant {
                id
                name
                product {
                  id
                  name
                  thumbnail {
                    url
                  }
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

interface OrderLine {
  id: string;
  quantity: number;
  totalPrice: {
    gross: {
      amount: number;
      currency: string;
    };
  };
  variant: {
    id: string;
    name: string;
    product: {
      id: string;
      name: string;
      thumbnail: {
        url: string;
      };
    };
  };
}

interface Order {
  id: string;
  number: string;
  created: string;
  status: string;
  total: {
    gross: {
      amount: number;
      currency: string;
    };
  };
  shippingAddress: {
    firstName: string;
    lastName: string;
    streetAddress1: string;
    city: string;
    country: {
      country: string;
    };
  };
  lines: OrderLine[];
}

const AccountOrder = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  
  const { data, loading, error, refetch } = useQuery(GET_USER_ORDERS, {
    variables: {
      first: 20
    },
    onCompleted: (data) => {
      if (data?.me?.orders?.edges) {
        setOrders(data.me.orders.edges.map((edge: any) => edge.node));
      }
    },
    onError: (error) => {
      console.error("Error fetching orders:", error);
      // If there's an authentication error, redirect to login
      if (error.graphQLErrors?.some(err => err.extensions?.code === 'InvalidTokenError')) {
        router.push("/login");
      }
    }
  });

  // Redirect if not authenticated (no user data and not loading)
  useEffect(() => {
    if (!loading && !data?.me) {
      router.push("/login");
    }
  }, [loading, data?.me, router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'fulfilled':
        return 'text-green-600';
      case 'canceled':
        return 'text-red-600';
      case 'draft':
        return 'text-gray-600';
      case 'unfulfilled':
        return 'text-yellow-600';
      default:
        return 'text-primary-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'fulfilled':
        return 'Delivered';
      case 'canceled':
        return 'Canceled';
      case 'draft':
        return 'Draft';
      case 'unfulfilled':
        return 'Processing';
      default:
        return status;
    }
  };

  const renderProductItem = (line: OrderLine, index: number) => {
    const { variant, quantity, totalPrice } = line;
    const productName = variant.product.name;
    const variantName = variant.name;
    const imageUrl = variant.product.thumbnail?.url || "/images/placeholder-product.png";

    return (
      <div key={index} className="flex py-4 sm:py-7 last:pb-0 first:pt-0">
        <div className="relative h-24 w-16 sm:w-20 flex-shrink-0 overflow-hidden rounded-none bg-slate-100">
          <Image
            fill
            sizes="100px"
            src={imageUrl}
            alt={productName}
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between">
              <div>
                <h3 className="text-base font-medium line-clamp-1">{productName}</h3>
                {variantName && (
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    <span>{variantName}</span>
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-base font-medium">
                  {totalPrice.gross.currency} {totalPrice.gross.amount}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-1 items-end justify-between text-sm">
            <p className="text-gray-500 dark:text-slate-400 flex items-center">
              <span className="hidden sm:inline-block">Qty</span>
              <span className="inline-block sm:hidden">x</span>
              <span className="ml-2">{quantity}</span>
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderOrder = (order: Order) => {
    return (
      <div key={order.id} className="border border-slate-200 dark:border-slate-700 overflow-hidden z-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 sm:p-8 bg-slate-50 dark:bg-slate-500/5">
          <div>
            <p className="text-lg font-medium">#{order.number}</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 sm:mt-2">
              <span>{formatDate(order.created)}</span>
              <span className="mx-2">·</span>
              <span className={getStatusColor(order.status)}>
                {getStatusText(order.status)}
              </span>
            </p>
          </div>
          <div className="mt-3 sm:mt-0">
            <p className="text-lg font-medium">
              {order.total.gross.currency} {order.total.gross.amount}
            </p>
          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700 p-2 sm:p-8 divide-y divide-y-slate-200 dark:divide-slate-700">
          {order.lines.map(renderProductItem)}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-10 sm:space-y-12">
        <h2 className="text-2xl sm:text-3xl">Order History</h2>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-10 sm:space-y-12">
        <h2 className="text-2xl sm:text-3xl">Order History</h2>
        <div className="text-center py-12">
          <p className="text-red-600">Error loading orders: {error.message}</p>
          <button 
            onClick={() => refetch()}
            className="mt-4 text-sm text-primary-500 hover:text-primary-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!data?.me) {
    return (
      <div className="space-y-10 sm:space-y-12">
        <h2 className="text-2xl sm:text-3xl">Order History</h2>
        <div className="text-center py-12">
          <p className="text-gray-600">Please log in to view your orders.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 sm:space-y-12">
      <h2 className="text-2xl sm:text-3xl">Order History</h2>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet. When you do, they'll appear here.
            </p>
            <ButtonSecondary href="/">
              Continue Shopping
            </ButtonSecondary>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map(renderOrder)}
        </div>
      )}
    </div>
  );
};

export default AccountOrder;
