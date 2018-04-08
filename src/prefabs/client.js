module.exports = () => {
  return `;(function(){
        var socket = new WebSocket('ws://localhost:12321')
        socket.addEventListener('message', function(e) {
          var data = JSON.parse(e.data)
          data.forEach(function(change){
              if(change.type === 'TAG') {
                  var i = change.tagId,
                      node = document.querySelector('#link-' + i)
                  
                  
                  var newNode = document.createElement('link')
                  newNode.id = node.id
                  newNode.rel = node.rel
                  newNode.href = node.href
                  
                  node.parentNode.replaceChild(newNode, node)
              }
              
              if(change.type === 'REFRESH') {
                  location.reload()
              }
          })
        })
  })()`
}
