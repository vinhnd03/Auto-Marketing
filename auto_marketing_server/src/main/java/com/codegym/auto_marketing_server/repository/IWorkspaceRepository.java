package com.codegym.auto_marketing_server.repository;

import com.codegym.auto_marketing_server.entity.Workspace;
import com.codegym.auto_marketing_server.enums.WorkspaceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IWorkspaceRepository extends JpaRepository<Workspace, Long> {
    @Query(value = "SELECT w.*" +
            "FROM workspaces w " +
            "JOIN social_account_workspace saw ON saw.workspace_id = w.id " +
            "JOIN social_accounts sa ON sa.id = saw.social_account_id " +
            "JOIN users u ON u.id = sa.user_id " +
            "WHERE u.id = :id",
            nativeQuery = true)
    List<Workspace> searchWorkspaceByUserId(@Param("id") Long id);

    @Query(value = "select count(*) from workspaces w \n" +
            "join social_account_workspace saw on w.id=saw.workspace_id\n" +
            "join social_accounts sa on sa.id=saw.social_account_id\n" +
            "join users u on u.id=sa.user_id where u.id=:id", nativeQuery = true)
    int totalWorkspaceOfUser(@Param("id") Long id);


    @Query(value =
            "SELECT COUNT(*) " +
                    "FROM workspaces w " +
                    "JOIN social_account_workspace saw ON saw.workspace_id = w.id " +
                    "JOIN social_accounts sa ON sa.id = saw.social_account_id " +
                    "JOIN users u ON u.id = sa.user_id " +
                    "WHERE w.name = :name AND u.id = :userId",
            nativeQuery = true)
    Integer countWorkspaceByNameAndUser(@Param("name") String name,
                                        @Param("userId") Long userId);


    @Query(
            value = "SELECT COUNT(*) " +
                    "FROM workspaces w " +
                    "JOIN social_account_workspace saw ON saw.workspace_id = w.id " +
                    "JOIN social_accounts sa ON sa.id = saw.social_account_id " +
                    "JOIN users u ON u.id = sa.user_id " +
                    "WHERE w.name = :name AND u.id = :userId AND w.id <> :excludeId",
            nativeQuery = true
    )
    Integer countWorkspaceByNameAndUserExceptId(@Param("name") String name,
                                                @Param("userId") Long userId,
                                                @Param("excludeId") Long excludeId);
}
