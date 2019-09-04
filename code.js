let strSpaces = "  ";
if (figma.command === 'copy') {
    let copyNodes = figma.currentPage.selection;
    figma.root.setPluginData('copiedNodes', JSON.stringify(copyNodes));
    figma.closePlugin(`💾${strSpaces}Saved node in cache`);
}
if (figma.command === 'paste') {
    let selectedNodes = figma.currentPage.selection;
    let copyNodes = null;
    try {
        copyNodes = JSON.parse(figma.root.getPluginData('copiedNodes'));
    }
    catch (e) {
        figma.closePlugin();
    }
    if (copyNodes && copyNodes[0] && copyNodes[0].id) {
        let findNode = figma.getNodeById(copyNodes[0].id);
        if (findNode) {
            selectedNodes.forEach(element => {
                if (!findNode.removed) {
                    let clonedNode = findNode.clone();
                    element.parent.appendChild(clonedNode);
                    clonedNode.x = element.x;
                    clonedNode.y = element.y;
                    element.remove();
                }
                else {
                    figma.closePlugin(`Original node was removed!`);
                }
            });
        }
        else {
            figma.closePlugin(`Original node was removed!`);
        }
    }
}
if (figma.command === 'clear') {
    figma.root.setPluginData('copiedNodes', '{}');
    figma.closePlugin(`🗑${strSpaces}Cache cleared`);
}
figma.closePlugin();
