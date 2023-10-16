console.log('-------------------- index.js ---------------------------')

const CHUNK_SIZE = 1 * 1024
const MAX_REQUEST_NUM = 3
let file = undefined
const doms = {
  fileDom: document.querySelector('#file'),
  uploadDom: document.querySelector('#uploadBtn'),
}

// 监听文件选择
doms.fileDom.addEventListener('change', (ev) => {
  if (!ev.target.files) return

  file = ev.target.files[0]
})

// 监听按钮点击，进行后续操作
doms.uploadDom.addEventListener('click', () => {
  if (!file) return
  const chunkList = createChunkList()
  upload(chunkList)
})

function createChunkList() {
  let cur = 0
  const list = []
  while (cur < file.size) {
    list.push(file.slice(cur, cur + CHUNK_SIZE))
    cur += CHUNK_SIZE
  }

  return list
}

// 并发控制
function upload(list) {
  const filename = file.name
  let count = 0
  const result = new Array(len).fill(false);
  const uploadSingleChunk = () => {
    let current = count++
    if (current >= list.length) {
      return
    }

    const xhr = new XMLHttpRequest()
    xhr.open('post', url)
    Object.keys(headers).forEach(key =>
      xhr.setRequestHeader(key, headers[key])
    )
    xhr.send(data)
    xhr.onload = e => {
      result[current] = e
      if (current < list.length) {
        uploadSingleChunk()
      }
    }
    xhr.onerror = e => {
      result[current] = e
      if (current < list.length) {
        uploadSingleChunk()
      }
    }
  }

  while (count < MAX_REQUEST_NUM) {
    uploadSingleChunk()
  }
}

function uploadSingleChunk() {
  count++
  const xhr = new XMLHttpRequest()
  xhr.open('post', url)
  Object.keys(headers).forEach(key =>
    xhr.setRequestHeader(key, headers[key])
  )
  xhr.send(data)
  xhr.onload = e => {
    // 判断是否成功，然后请求下一个
    result
  }
}

