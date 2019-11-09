import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import 'style/categoryTree.scss';
import { bundle } from 'i18n/bundle';
import { fetchAllCategories, setParentCategory, setRemoveCategory, setChangeCategories } from 'reducers/category/categoryAction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { faPlusSquare, faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import Modal from 'components/global/fragments/Modal';
import CategoryEditor from './fragments/CategoryEditor';

const CategoryMaintenance = () => {
    const dispatch = useDispatch();
    let refresh = useSelector(state => state.global.refresh);
    let categoryTree = useSelector(state => state.category.all);
    let [categoryHint, setCategoryHint] = useState(null);
    let [categoryRemove, setCategoryRemove] = useState(null);

    useEffect(() => {
        dispatch(fetchAllCategories());
    }, [dispatch, refresh]);

    const handleEditRow = categoryHint => {
        setCategoryHint(categoryHint);
    };

    const handleCreateRow = (categoryHint, parent) => {
        if(parent){
            setCategoryHint({...categoryHint, parentId: parent.id});
            return;
        }
        setCategoryHint({...categoryHint});
    };

    const handleRemoveRow = categoryHint => {
        setCategoryRemove(categoryHint);
    };

    const removeCategory = () => {
        dispatch(setRemoveCategory(categoryRemove));
        setCategoryRemove(null);
    };

    const updateParent = (currentNode, parentNode) => {
        currentNode.parentId = (parentNode && parentNode.id) ? parentNode.id : null;
        dispatch(setParentCategory(currentNode));
    };

    const renderRowOptions = rowData => {
        return {
            buttons: [
                <div className="row-options edit" onClick={() => handleEditRow(rowData.node)}>
                    <FontAwesomeIcon icon={faEdit} />
                </div>,
                <div
                    className={
                        rowData.node.children && rowData.node.children.length
                            ? 'row-options remove hidden'
                            : 'row-options remove'
                    }
                    onClick={() => handleRemoveRow(rowData.node)}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                </div>,
                <div className="row-options plus" onClick={() => handleCreateRow({}, rowData.node)}>
                    <FontAwesomeIcon icon={faPlusSquare} />
                </div>
            ]
        };
    };

    return (
        <div className="category-maintenance">
            {categoryHint && (
                <Modal title={bundle('category.editor')} setShow={() => setCategoryHint(null)}>
                    <CategoryEditor
                        onCancel={() => setCategoryHint(null)}
                        category={categoryHint}
                    />
                </Modal>
            )}
            {categoryRemove && (
                <Modal title={bundle('remove.category')} setShow={() => setCategoryRemove(null)}>
                    <p>
                        {bundle('remove.category.confirmation', categoryRemove.name)}
                    </p>
                    <div className="modal-footer p10">
                        <button type="button" className="btn btn btn-outline-secondary btn-sm" onClick={() => setCategoryRemove(null)}>{bundle('cancel')}</button>
                        <button type="button" className="btn btn-danger btn-sm" onClick={removeCategory}>{bundle('remove')}</button>
                    </div>
                </Modal>
            )}
            <h1 className="page-title">{bundle('maintenance.category')}</h1>
            <div className="category-add-root" onClick={() => handleCreateRow({})}>
                <FontAwesomeIcon icon={faPlusCircle} />
                {bundle('add.root.category')}
            </div>
            {categoryTree && (
                <SortableTree
                    treeData={categoryTree}
                    onChange={(category) => dispatch(setChangeCategories(category))}
                    onMoveNode={({ node, nextParentNode }) => updateParent(node, nextParentNode)}
                    getNodeKey={({ node }) => node.id}
                    isVirtualized={false}
                    generateNodeProps={renderRowOptions}
                />
            )}
        </div>
    );
};

export default CategoryMaintenance;
