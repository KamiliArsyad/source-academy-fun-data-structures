/*
-------------- HELLO --------------------
This is a project to create a doubly linked list data structure using Source language
in Source Academy.

The doubly linked list is defined below. I decided to make it not loop around in the tail:
prevNode(head) is not pointing to the list's tail
and nextNode(tail) is not pointing to the list's head
*/

/*
Triplet Structure: [previous node, item, next node]
*/
const triplet = (x, y, z) => [x, y, z];
const getItem = triplet => triplet[1];
const prevNode = triplet => triplet[0];
const nextNode = triplet => triplet[2];
const setNext = (triplet, x) => {triplet[2] = x;};
const setItem = (triplet, x) => {triplet[1] = x;};
const setPrev = (triplet, x) => {triplet[0] = x;};

function dL_ref(dlst, n) {
    return n === 0
        ? getItem(dlst)
        : dL_ref(nextNode(dlst), n-1);
}

function dL_map(f, dlst) {
    function creator(dlst, prev) {
        if(is_null(dlst)) {
            return null;
        } else {
            const result = triplet(prev, f(getItem(dlst)), null);
            const next = creator(nextNode(dlst), result);
            setNext(result, next);
            
            return result;
        }
    }
    
    return creator(dlst, null);
}

function dL_toList(dlst) {
    return is_null(dlst)
        ? null
        : pair( getItem(dlst), 
                dL_toList(nextNode(dlst))
                );
}

function dL_toList_deep(dlst) {
    return is_null(dlst)
        ? null
        : !is_number(getItem(dlst)) && !is_string(getItem(dlst))
        ? pair( dL_toList_deep(getItem(dlst)), dL_toList_deep(nextNode(dlst)) )
        : pair( getItem(dlst), 
                dL_toList_deep(nextNode(dlst))
                );
}

/*
Definition:
A doubleList is either a null, or a triplet whose head (prevNode) a doubleList and whose
tail (nextNode) is a doubleList.
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
