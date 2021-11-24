using Microsoft.EntityFrameworkCore.Migrations;

namespace InfraStructure.Migrations.Store
{
    public partial class phone : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "FarmProposals");

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "FarmProposals",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Phone",
                table: "FarmProposals");

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "FarmProposals",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
