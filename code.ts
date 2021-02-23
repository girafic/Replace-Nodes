if (figma.command === 'copy') {
  let copyNodes = figma.currentPage.selection;
  figma.root.setPluginData('copiedNodes', JSON.stringify(copyNodes));
  figma.currentPage.setRelaunchData({})
  figma.closePlugin(`💾 Saved node in cache`);
}
if (figma.command === 'paste' || figma.command === 'pasteAndAdjustSize' || figma.command === 'placeOver'  ) {
  let selectedNodes = figma.currentPage.selection
  let copyNodes = null;
  let clonedNodes = [];
  try {
    copyNodes = JSON.parse(figma.root.getPluginData('copiedNodes'));
  } catch (e) {
    figma.closePlugin();
  }
  if (copyNodes && copyNodes[0] && copyNodes[0].id) {
    let findNode = figma.getNodeById(copyNodes[0].id) as SceneNode;
    if (findNode) {
      if (selectedNodes.length > 0) {
        selectedNodes.forEach(element => {
          if (!findNode.removed) {
            let clonedNode = findNode.clone();
            clonedNodes.push(clonedNode)
            let index  = element.parent.children.indexOf(element);
            if (figma.command === 'placeOver') {
              index++
            }
            element.parent.insertChild(index, clonedNode);
            clonedNode.x = element.x;
            clonedNode.y = element.y;
            if (figma.command === 'pasteAndAdjustSize') {
              clonedNode.resize(element.width, element.height);
            }
            if (figma.command !== 'placeOver') {
              element.remove();
            }
            figma.currentPage.selection = clonedNodes;
          } else {
            figma.closePlugin(`Original node was removed! 🙁`);
          }
        })
      } else {
        figma.closePlugin(`Select one or more nodes!`);
      }
    } else {
      figma.closePlugin(`Original node was removed! 🙁`);
    }
  } else {
    figma.closePlugin('Nothing copied or cache cleared?');
  }
}
if (figma.command === 'clear') {
  figma.root.setPluginData('copiedNodes', '{}');
  figma.closePlugin(`🗑 Cache cleared`);
}
figma.closePlugin();