package com.toko.maju.service.mapper;

import com.toko.maju.domain.*;
import com.toko.maju.service.dto.ProjectProductDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity ProjectProduct and its DTO ProjectProductDTO.
 */
@Mapper(componentModel = "spring", uses = {ProductMapper.class, ProjectMapper.class, UnitMapper.class})
public interface ProjectProductMapper extends EntityMapper<ProjectProductDTO, ProjectProduct> {

    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.name", target = "productName")
    @Mapping(source = "project.id", target = "projectId")
    @Mapping(source = "project.name", target = "projectName")
    @Mapping(source = "product.unitPrice", target = "unitPrice")
    @Mapping(source = "product.sellingPrice", target = "sellingPrice")
    @Mapping(source = "product.barcode", target = "barcode")
    @Mapping(source = "product.unit.name", target = "unit")
	@Mapping(source = "product.supplier.code", target = "supplierCode")
	@Mapping(source = "product.supplier.name", target = "supplierName")
    ProjectProductDTO toDto(ProjectProduct projectProduct);

    @Mapping(source = "productId", target = "product")
    @Mapping(source = "projectId", target = "project")
    ProjectProduct toEntity(ProjectProductDTO projectProductDTO);

    default ProjectProduct fromId(Long id) {
        if (id == null) {
            return null;
        }
        ProjectProduct projectProduct = new ProjectProduct();
        projectProduct.setId(id);
        return projectProduct;
    }
}
