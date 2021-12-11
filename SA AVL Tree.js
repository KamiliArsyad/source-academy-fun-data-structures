/*
-------------- ABOUT THIS PROJECT ----------------
This is a project to create a fully working functional AVL tree, also known as
balanced binary search tree (traversal order).
The tree is self-balancing, mutable, and includes all the good interfaces described below.

The tree uses a doubleList data structure (another project) to allow bidirectional
parent-child access.
*/

// --------------------------------------------------------------------------------------
// DOUBLE LIST DATA STRUCTURE
// --------------------------------------------------------------------------------------

//interfaces
const triplet = (x, y, z) => [x, y, z];
const getItem = triplet => triplet[1];
const prevNode = triplet => triplet[0];
const nextNode = triplet => triplet[2];
const setNext = (triplet, x) => {triplet[2] = x;};
const setItem = (triplet, x) => {triplet[1] = x;};
const setPrev = (triplet, x) => {triplet[0] = x;};

/*
A doubleList is a triplet whose head (prevNode) is null or a doubleList, and whose
tail (nextNode) is null or a doubleList
*/
function doubleList(lst) {
    function creator(lst, prev) {
        if(is_null(lst)) {
            return null;
        } else {
            const result = triplet(prev, head(lst), null);
            const next = creator(tail(lst), result);
            setNext(result, next);
            
            return result;
        }
    }
    
    return creator(lst, null);
}
// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------


/*
------------------------------------
        Binary Search Tree
------------------------------------
*/

// structure format: doubleList(list(parent, left_child, [item, props], right_child))
// basic interfaces
const createNode = (parent, item, props) => doubleList(list(parent, null, [item, props], null));
const getParent = node => getItem(node);
const getNodeItem = node => getItem(nextNode(nextNode(node)))[0];
const getNodeProp = node => getItem(nextNode(nextNode(node)))[1];
const getLeftChild = node => getItem(nextNode(node));
const getRightChild = node => getItem(nextNode(nextNode(nextNode(node))));










