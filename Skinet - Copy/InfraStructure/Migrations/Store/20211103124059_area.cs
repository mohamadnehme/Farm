using Microsoft.EntityFrameworkCore.Migrations;

namespace InfraStructure.Migrations.Store
{
    public partial class area : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Area",
                table: "FarmProposals",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Area",
                table: "FarmProposals");
        }
    }
}
