using Microsoft.EntityFrameworkCore.Migrations;

namespace InfraStructure.Migrations.Store
{
    public partial class photosP : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PrictureUrl",
                table: "FarmProposals");

            migrationBuilder.AddColumn<int>(
                name: "FarmProposalId",
                table: "Photos",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Photos_FarmProposalId",
                table: "Photos",
                column: "FarmProposalId");

            migrationBuilder.AddForeignKey(
                name: "FK_Photos_FarmProposals_FarmProposalId",
                table: "Photos",
                column: "FarmProposalId",
                principalTable: "FarmProposals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photos_FarmProposals_FarmProposalId",
                table: "Photos");

            migrationBuilder.DropIndex(
                name: "IX_Photos_FarmProposalId",
                table: "Photos");

            migrationBuilder.DropColumn(
                name: "FarmProposalId",
                table: "Photos");

            migrationBuilder.AddColumn<string>(
                name: "PrictureUrl",
                table: "FarmProposals",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
