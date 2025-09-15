#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://faymfhhhxvboogfixlxw.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZheW1maGhoeHZib29nZml4bHh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMDAzOTYsImV4cCI6MjA2NDg3NjM5Nn0.lv4yNm4j3VXJq-n-HJdCcZOI13yjUvSiYPnotgdPhKo'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function createInterviewTest({ name, field_1, field_2, field_3 }) {
  const { data, error } = await supabase
    .from('Interview_Tests')
    .insert([{ name, field_1, field_2, field_3 }])
    .select()
    .single()
  if (error) throw error
  return data
}

async function listInterviewTests({ limit = 100 } = {}) {
  const { data, error } = await supabase
    .from('Interview_Tests')
    .select('*')
    .order('id', { ascending: true })
    .limit(limit)
  if (error) throw error
  return data
}

async function getInterviewTestById(id) {
  const { data, error } = await supabase
    .from('Interview_Tests')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

async function updateInterviewTest(id, { name, field_1, field_2, field_3 }) {
  const update = {}
  if (name !== undefined) update.name = name
  if (field_1 !== undefined) update.field_1 = field_1
  if (field_2 !== undefined) update.field_2 = field_2
  if (field_3 !== undefined) update.field_3 = field_3

  const { data, error } = await supabase
    .from('Interview_Tests')
    .update(update)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

async function deleteInterviewTest(id) {
  const { error } = await supabase
    .from('Interview_Tests')
    .delete()
    .eq('id', id)
  if (error) throw error
  return { success: true }
}

function parseJSONSafe(value) {
  if (value === undefined || value === null || value === '') return null
  try { return JSON.parse(value) } catch { return value }
}

async function main() {
  const [,, cmd, ...args] = process.argv
  try {
    switch (cmd) {
      case 'create': {
        const payload = {
          name: args[0] || null,
          field_1: parseJSONSafe(args[1]),
          field_2: args[2] ? Number(args[2]) : null,
          field_3: args[3] ? args[3] === 'true' : null,
        }
        const row = await createInterviewTest(payload)
        console.log(JSON.stringify(row, null, 2))
        break
      }
      case 'list': {
        const limit = args[0] ? Number(args[0]) : 100
        const rows = await listInterviewTests({ limit })
        console.log(JSON.stringify(rows, null, 2))
        break
      }
      case 'get': {
        const id = Number(args[0])
        if (!id) throw new Error('Usage: node index.js get <id>')
        const row = await getInterviewTestById(id)
        console.log(JSON.stringify(row, null, 2))
        break
      }
      case 'update': {
        const id = Number(args[0])
        if (!id) throw new Error('Usage: node index.js update <id> [name] [field_1_json] [field_2_number] [field_3_boolean]')
        const payload = {
          name: args[1],
          field_1: parseJSONSafe(args[2]),
          field_2: args[3] !== undefined ? Number(args[3]) : undefined,
          field_3: args[4] !== undefined ? args[4] === 'true' :undefined,
        }
        const row = await updateInterviewTest(id, payload)
        console.log(JSON.stringify(row, null, 2))
        break
      }
      case 'delete': {
        const id = Number(args[0])
        if (!id) throw new Error('Usage: node index.js delete <id>')
        const res = await deleteInterviewTest(id)
        console.log(JSON.stringify(res, null, 2))
        break
      }
      default: {
        console.log('Usage:')
        console.log('  node index.js list [limit]')
        console.log('  node index.js create <name|null> <field_1_json|null> <field_2_number|null> <field_3_boolean|null>')
        console.log('  node index.js get <id>')
        console.log('  node index.js update <id> [name] [field_1_json] [field_2_number] [field_3_boolean]')
        console.log('  node index.js delete <id>')
      }
    }
  } catch (err) {
    console.error('Error:', err.message)
    process.exitCode = 1
  }
}

if (require.main === module) {
  main()
}

module.exports = {
  createInterviewTest,
  listInterviewTests,
  getInterviewTestById,
  updateInterviewTest,
  deleteInterviewTest,
}
