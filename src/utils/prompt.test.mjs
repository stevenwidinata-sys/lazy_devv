import assert from 'node:assert/strict'
import { applyTemplate, appendEnhancers, getLaunchUrl, isHttpUrl } from './prompt.js'

assert.equal(applyTemplate('Ask: {input}', '  hello  '), 'Ask: hello')
assert.equal(appendEnhancers('Question', ['Use bullets.']), 'Question\n\nUse bullets.')
assert.equal(isHttpUrl('https://example.com'), true)
assert.equal(isHttpUrl('javascript:alert(1)'), false)
assert.equal(getLaunchUrl({ url: 'https://example.com', promptUrl: (prompt) => `https://x.test?q=${prompt}` }, 'hello world'), 'https://x.test?q=hello%20world')

console.log('prompt utilities: ok')
