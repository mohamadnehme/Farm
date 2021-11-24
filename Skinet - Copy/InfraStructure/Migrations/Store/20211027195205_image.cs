using Microsoft.EntityFrameworkCore.Migrations;

namespace InfraStructure.Migrations.Store
{
    public partial class image : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PrictureUrl",
                table: "FarmProposals",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PrictureUrl",
                table: "FarmProposals");
        }
    }
}
