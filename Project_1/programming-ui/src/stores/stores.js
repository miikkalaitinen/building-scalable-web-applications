import { readable } from 'svelte/store'

let user = localStorage.getItem('userUuid')

if (!user) {
  user = crypto.randomUUID().toString()
  localStorage.setItem('userUuid', user)
}

export let points = 0

export const userUuid = readable(user)
