terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=3.0.0"
    }
  }
}

# Configure the Microsoft Azure Provider
provider "azurerm" {
  features {}
  subscription_id = "d18efcbe-caa9-4004-ac2c-7312261e11de"
}

resource "azurerm_resource_group" "rgw" {
  name     = "wmbouranga-rg"
  location = "West Europe"
}

resource "azurerm_virtual_network" "rgw" {
  name                = "winn-network"
  resource_group_name = azurerm_resource_group.rgw.name
  location            = azurerm_resource_group.rgw.location
  address_space       = ["10.0.0.0/16"]
}

resource "azurerm_subnet" "rgw" {
  name                 = "internal"
  resource_group_name  = azurerm_resource_group.rgw.name
  virtual_network_name = azurerm_virtual_network.rgw.name
  address_prefixes     = ["10.0.2.0/24"]
}

resource "azurerm_public_ip" "rgw" {
  name                = "rgw-virtual-machine-ip"
  resource_group_name = azurerm_resource_group.rgw.name
  location            = azurerm_resource_group.rgw.location
  allocation_method   = "Static"
}


resource "azurerm_network_interface" "rgw" {
  name                = "test-nic"
  location            = azurerm_resource_group.rgw.location
  resource_group_name = azurerm_resource_group.rgw.name

  ip_configuration {
    name                          = "testconfiguration1"
    subnet_id                     = azurerm_subnet.rgw.id
    private_ip_address_allocation = "Static"
    private_ip_address            = "10.0.2.5"
    public_ip_address_id          = azurerm_public_ip.rgw.id
  }

  lifecycle {
    create_before_destroy = true
  }
}


resource "azurerm_linux_virtual_machine" "rgw" {
  name                = "wmbouranga-vm"
  resource_group_name = azurerm_resource_group.rgw.name
  location            = azurerm_resource_group.rgw.location
  size                = "Standard_B1s"
  admin_username      = "ubuntu"
  
  network_interface_ids = [azurerm_network_interface.rgw.id]

  admin_ssh_key {
    username   = "ubuntu"
    public_key = file("~/.ssh/id_rsa.pub")
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    offer                 = "0001-com-ubuntu-server-focal"
    publisher             = "Canonical"
    sku                   = "20_04-lts-gen2"
    version   = "latest"
  }

  tags = {
    Projet = "Démo"
  }
}

