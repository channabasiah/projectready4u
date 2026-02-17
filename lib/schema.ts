import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  project_name: text('project_name').notNull(),
  description: text('description'),
  category: text('category'),
  status: text('status').default('active'),
  tech_stack: text('tech_stack'),
  what_included: text('what_included'),
  price: real('price'),
  discount_price: real('discount_price'),
  github_repo_url: text('github_repo_url'),
  demo_video_url: text('demo_video_url'),
  createdAt: text('created_at'),
  updatedAt: text('updated_at'),
})

export const access_requests = sqliteTable('access_requests', {
  id: text('id').primaryKey(),
  projectId: text('project_id')
    .notNull()
    .references(() => projects.id),
  user_name: text('user_name'),
  user_email: text('user_email').notNull(),
  user_college: text('user_college'),
  user_phone: text('user_phone'),
  message: text('message'),
  status: text('status').default('pending'),
  admin_notes: text('admin_notes'),
  request_date: text('request_date'),
  approved_date: text('approved_date'),
  createdAt: text('created_at'),
})

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  isAdmin: integer('is_admin').default(0),
  createdAt: text('created_at'),
})
