import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { RoleGuard } from 'src/guards/role-guard';

import { Layout as DashboardLayout } from 'src/layouts/dashboard';

const OverviewPage = lazy(() => import('src/pages/dashboard/index'));

// Academy
const AcademyDashboardPage = lazy(() => import('src/pages/dashboard/academy/dashboard'));
const AcademyCoursePage = lazy(() => import('src/pages/dashboard/academy/course'));

// Blog
const BlogPostListPage = lazy(() => import('src/pages/dashboard/blog/list'));
const BlogPostDetailPage = lazy(() => import('src/pages/dashboard/blog/detail'));
const BlogPostCreatePage = lazy(() => import('src/pages/dashboard/blog/create'));

// Customer
const CustomerListPage = lazy(() => import('src/pages/dashboard/customers/list'));
const CustomerDetailPage = lazy(() => import('src/pages/dashboard/customers/detail'));
const CustomerEditPage = lazy(() => import('src/pages/dashboard/customers/edit'));

// User
const UserPage = lazy(() => import('src/pages/dashboard/users'));

// Invoice
const InvoiceListPage = lazy(() => import('src/pages/dashboard/invoices/list'));
const InvoiceDetailPage = lazy(() => import('src/pages/dashboard/invoices/detail'));

// Job
const JobBrowsePage = lazy(() => import('src/pages/dashboard/jobs/browse'));
const JobCreatePage = lazy(() => import('src/pages/dashboard/jobs/create'));
const CompanyDetailPage = lazy(() => import('src/pages/dashboard/jobs/companies/detail'));

// Logistics
const LogisticsDashboardPage = lazy(() => import('src/pages/dashboard/logistics/dashboard'));
const LogisticsFleetPage = lazy(() => import('src/pages/dashboard/logistics/fleet'));

// Order
const OrderListPage = lazy(() => import('src/pages/dashboard/orders/list'));
const OrderDetailPage = lazy(() => import('src/pages/dashboard/orders/detail'));

// Product
const ProductListPage = lazy(() => import('src/pages/dashboard/products/list'));
const ProductCreatePage = lazy(() => import('src/pages/dashboard/products/create'));

// Social
const SocialFeedPage = lazy(() => import('src/pages/dashboard/social/feed'));
const SocialProfilePage = lazy(() => import('src/pages/dashboard/social/profile'));

// Analytic
const AnalyticsSummaryPage = lazy(() => import('src/pages/dashboard/analytics/summary'));
const AnalyticsPurchasesPage = lazy(() => import('src/pages/dashboard/analytics/purchases'));
const AnalyticsSalesPage = lazy(() => import('src/pages/dashboard/analytics/sales'));
const AnalyticsSunatPage = lazy(() => import('src/pages/dashboard/analytics/sunat'));
const AnalyticsVouchingPage = lazy(() => import('src/pages/dashboard/analytics/vouching'));
const AnalyticsPdt621Page = lazy(() => import('src/pages/dashboard/analytics/pdt621'));

// Other
const AccountPage = lazy(() => import('src/pages/dashboard/account'));
const BlankPage = lazy(() => import('src/pages/dashboard/blank'));
const CalendarPage = lazy(() => import('src/pages/dashboard/calendar'));
const SunKeyPage = lazy(() => import('src/pages/dashboard/sun-key'));
const ChatPage = lazy(() => import('src/pages/dashboard/chat'));
const CryptoPage = lazy(() => import('src/pages/dashboard/crypto'));
const EcommercePage = lazy(() => import('src/pages/dashboard/ecommerce'));
const FileManagerPage = lazy(() => import('src/pages/dashboard/file-manager'));
const KanbanPage = lazy(() => import('src/pages/dashboard/kanban'));
const MailPage = lazy(() => import('src/pages/dashboard/mail'));

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <DashboardLayout>
        <Suspense>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      {
        index: true,
        element: <OverviewPage />,
      },
      {
        path: 'academy',
        children: [
          {
            index: true,
            element: <AcademyDashboardPage />,
          },
          {
            path: 'courses',
            children: [
              {
                path: ':courseId',
                element: <AcademyCoursePage />,
              },
            ],
          },
        ],
      },
      {
        path: 'blog',
        children: [
          {
            index: true,
            element: <BlogPostListPage />,
          },
          {
            path: 'create',
            element: <BlogPostCreatePage />,
          },
          {
            path: ':postId',
            element: <BlogPostDetailPage />,
          },
        ],
      },
      {
        path: 'customers',
        children: [
          {
            index: true,
            element: <CustomerListPage />,
          },
          {
            path: ':customerId',
            element: <CustomerDetailPage />,
          },
          {
            path: ':customerId/edit',
            element: <CustomerEditPage />,
          },
        ],
      },
      {
        path: 'users',
        element: (
          <RoleGuard allowedRoles={['admin']}>
            <UserPage />
          </RoleGuard>
        ),
      },
      {
        path: 'invoices',
        children: [
          {
            index: true,
            element: <InvoiceListPage />,
          },
          {
            path: ':invoiceId',
            element: <InvoiceDetailPage />,
          },
        ],
      },
      {
        path: 'jobs',
        children: [
          {
            index: true,
            element: <JobBrowsePage />,
          },
          {
            path: 'create',
            element: <JobCreatePage />,
          },
          {
            path: 'companies',
            children: [
              {
                path: ':companyId',
                element: <CompanyDetailPage />,
              },
            ],
          },
        ],
      },
      {
        path: 'logistics',
        children: [
          {
            index: true,
            element: <LogisticsDashboardPage />,
          },
          {
            path: 'fleet',
            element: <LogisticsFleetPage />,
          },
        ],
      },
      {
        path: 'orders',
        children: [
          {
            index: true,
            element: <OrderListPage />,
          },
          {
            path: ':orderId',
            element: <OrderDetailPage />,
          },
        ],
      },
      {
        path: 'products',
        children: [
          {
            index: true,
            element: <ProductListPage />,
          },
          {
            path: 'create',
            element: <ProductCreatePage />,
          },
        ],
      },
      {
        path: 'social',
        children: [
          {
            path: 'feed',
            element: <SocialFeedPage />,
          },
          {
            path: 'profile',
            element: <SocialProfilePage />,
          },
        ],
      },
      {
        path: 'account',
        element: <AccountPage />,
      },
      {
        path: 'analytics',
        children: [
          {
            index: true,
            element: <AnalyticsSummaryPage />,
          },
          {
            path: 'purchases',
            element: <AnalyticsPurchasesPage />,
          },
          {
            path: 'sales',
            element: <AnalyticsSalesPage />,
          },
          {
            path: 'sunat',
            element: <AnalyticsSunatPage />,
          },
          {
            path: 'vouching',
            element: <AnalyticsVouchingPage />,
          },
          {
            path: 'pdt621',
            element: <AnalyticsPdt621Page />,
          },
        ],
      },
      {
        path: 'blank',
        element: <BlankPage />,
      },
      {
        path: 'calendar',
        element: <CalendarPage />,
      },
      {
        path: 'sun-key',
        element: <SunKeyPage />,
      },

      {
        path: 'chat',
        element: <ChatPage />,
      },
      {
        path: 'crypto',
        element: <CryptoPage />,
      },
      {
        path: 'ecommerce',
        element: <EcommercePage />,
      },
      {
        path: 'file-manager',
        element: <FileManagerPage />,
      },
      {
        path: 'kanban',
        element: <KanbanPage />,
      },
      {
        path: 'mail',
        element: <MailPage />,
      },
    ],
  },
];
