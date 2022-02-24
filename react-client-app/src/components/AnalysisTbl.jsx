import React from 'react'
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    VStack,
    Flex,
    Link,
    Grid,
    GridItem
} from "@chakra-ui/react"



function AnalysisTbl({data,values,filters}) {
    return (
        <div>
            <Table variant="striped" colorScheme="greyBasic">
                <Thead>
                    <Tr>
                        <Th>Rule Id</Th>
                        <Th>Ancestors/Descendants</Th>
                        <Th>Source</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {
                        data.map((item, index) =>
                            <Tr key={index}>
                                <Td>{item.rule_id} - {item.rule_name}</Td>
                                <Td>
                                    
                                    {item.anc_desc.map((element) =>
                                        <div>
                                        {element.ancestors.map(ancestor=>
                                            
                                                <div style={{ color: "#475da7"}}> {ancestor.a_id} - {ancestor.a_name} (A)</div>
                                            
                                            )}
                                        {element.descendants.map(descendant=>
                                            
                                                <div style={{ color: "#3db28c"}} > {descendant.d_id} - {descendant.d_name} (D)</div>
                                            )}
                                        </div>
                                    )}
                                </Td>

                                <Td>
                                {item.anc_desc.map((element) =>
                                    <div>
                                        {element.ancestors.map(ancestor=>
                                            <div style={{alignSelf: 'flex-start'}}>
                                                {ancestor.source.map(source_id=>{
                                                if(source_id.concept__content_type==15)
                                                    return <Link style={{ color: "#0000FF", }} href={window.u + "fields/?search=" + source_id.source_field__scan_report_table__id}> {source_id.source_field__name} </Link>
                                                return <Link style={{ color: "#0000FF", }} href={window.u + "values/?search=" + source_id.source_field__id}> {source_id.source_field__name} </Link>
                                            })}
                                            </div>
                                            
                                    )}
                                    {element.descendants.map(descendant=>
                                            <div style={{alignSelf: 'flex-start'}}>
                                                {descendant.source.map(source_id=>{
                                                if(source_id.concept__content_type==15)
                                                    return <Link style={{ color: "#0000FF", }} href={window.u + "fields/?search=" + source_id.source_field__scan_report_table__id}> {source_id.source_field__name} </Link>
                                                return <Link style={{ color: "#0000FF", }} href={window.u + "values/?search=" + source_id.source_field__id}> {source_id.source_field__name} </Link>
                                            })}
                                            </div>
                                            
                                    )}
                                    </div>
                                    )}
                                </Td>
                            </Tr>

                        )
                    }
                </Tbody>

            </Table>
        </div>)
}

export default AnalysisTbl;